import * as THREE from 'three';
import { introPose, stations } from './stations';
import { AU, bodies, longitude } from './planets';

/**
 * Per-tier settings (see quality.js). `low` skips the normal/specular maps
 * and loads quarter-size textures: ~0.4 MB instead of ~1.6 MB.
 */
const TIERS = {
	high: {
		textures: {
			earth: '/textures/earth_atmos_2048.jpg',
			earthNormal: '/textures/earth_normal_2048.jpg',
			earthSpecular: '/textures/earth_specular_2048.jpg',
			clouds: '/textures/earth_clouds_1024.png',
			moon: '/textures/moon_1024.jpg'
		},
		segments: 96,
		stars: 4000,
		maxPixelRatio: 2,
		antialias: true
	},
	low: {
		textures: {
			earth: '/textures/earth_atmos_1024.jpg',
			earthNormal: null,
			earthSpecular: null,
			clouds: '/textures/earth_clouds_512.png',
			moon: '/textures/moon_512.jpg'
		},
		segments: 48,
		stars: 1500,
		maxPixelRatio: 1.5,
		antialias: false
	}
};

const EARTH_RADIUS = 1.6;
const MOON_RADIUS = 0.43;
const MOON_ORBIT = 3;
// Idle motion, in radians per second. Kept slow so the scene feels calm.
const EARTH_SPIN = 0.012;
const CLOUD_SPIN = 0.017;
const MOON_ORBIT_SPEED = 0.015;
const MOON_SPIN = 0.015;
const PLANET_SPIN = 0.02;
// Drag: radians per pixel, and how fast a flick's momentum dies off.
const DRAG_SENSITIVITY = 0.006;
const SPIN_DECAY = 2.5;
// Where the sun sits as seen from the earth (front-left), which fixes how the
// whole map is turned: the home shots keep their familiar lighting.
const SUN_BEARING = Math.atan2(5, 6);
// Camera flights: base duration (s) plus extra per tenfold distance, and how
// high long flights arc over the ecliptic (share of the distance) to clear the sun.
const FLIGHT_TIME = 2.2;
const FLIGHT_TIME_PER_DECADE = 0.9;
const FLIGHT_ARC = 0.12;
// Page shots: camera distance in planet radii, and where the planet sits on
// screen as a share of that distance (right, up).
const PAGE_SHOT = { radii: 13, x: 0.5, y: 0.19 };
// Portrait has no free margin: tuck it into the top-right corner, partly off-screen.
const PAGE_SHOT_PORTRAIT = { radii: 21, x: 0.16, y: 0.37 };
// Page shots approach from the sunlit side, within this angle (radians).
const APPROACH_YAW = 1.2;
// Texture LOD, by on-screen radius in CSS pixels: textured above LOD_NEAR,
// back to a flat low-poly sphere (textures freed) below LOD_FAR.
const LOD_NEAR = 40;
const LOD_FAR = 12;
// Bodies passing behind text or navigation fade to this opacity, checked
// against these elements' on-screen boxes, re-read this often (ms).
const DIM_OPACITY = 0.15;
const TEXT_SELECTOR = 'h1, h2, h3, h4, p, li, a, button, img, nav';
const TEXT_REFRESH_MS = 300;
// Stars pop in over this window (seconds) once the recede starts.
const STAR_SPREAD = 6;
// Frame-rate watchdog: average over this many frames, after a warm-up that
// skips texture uploads and the intro. Below TARGET_FPS the resolution
// steps down; still below MIN_FPS at the lowest resolution, `onSlow` fires.
// TARGET_FPS sits under 30 so phones in battery saver (rAF capped at 30)
// aren't mistaken for slow ones.
const FPS_WARMUP = 90;
const FPS_WINDOW = 90;
const TARGET_FPS = 27;
const MIN_FPS = 18;
const MIN_PIXEL_RATIO = 0.75;

/**
 * A value that eases toward its target each frame (exponential damping), so
 * interrupted transitions blend instead of jumping.
 */
class Damped {
	/** @param {number} value @param {number} rate higher = snappier */
	constructor(value, rate) {
		this.value = value;
		this.target = value;
		this.rate = rate;
	}
	/** @param {number} dt */
	step(dt) {
		this.value += (this.target - this.value) * (1 - Math.exp(-this.rate * dt));
		return this.value;
	}
}

/** @param {number} t 0..1 */
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const starVertex = /* glsl */ `
	attribute float aSize;
	attribute float aAppear;
	attribute float aPhase;
	attribute vec3 aColor;
	uniform float uTime;
	uniform float uStart;
	uniform float uPixelRatio;
	varying float vAlpha;
	varying vec3 vColor;

	void main() {
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		float t = uTime - uStart - aAppear;
		float visible = step(0.0, t);
		// Brief overshoot so each star "pops" rather than fades.
		float pop = 1.0 + 1.6 * exp(-7.0 * max(t, 0.0));
		float twinkle = 0.7 + 0.3 * sin(uTime * (1.0 + aPhase) + aPhase * 6.2831);
		vAlpha = visible * smoothstep(0.0, 0.15, t) * twinkle;
		vColor = aColor;
		gl_PointSize = aSize * pop * uPixelRatio * (260.0 / -mv.z);
		gl_Position = projectionMatrix * mv;
	}
`;

const starFragment = /* glsl */ `
	varying float vAlpha;
	varying vec3 vColor;
	void main() {
		float d = length(gl_PointCoord - 0.5);
		float a = smoothstep(0.5, 0.0, d);
		gl_FragColor = vec4(vColor, a * a * vAlpha);
	}
`;

const atmosphereVertex = /* glsl */ `
	varying vec3 vNormal;
	varying vec3 vView;
	void main() {
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		vNormal = normalize(normalMatrix * normal);
		vView = normalize(-mv.xyz);
		gl_Position = projectionMatrix * mv;
	}
`;

const atmosphereFragment = /* glsl */ `
	uniform float uOpacity;
	uniform vec3 uColor;
	varying vec3 vNormal;
	varying vec3 vView;
	void main() {
		// Back faces: brightest just outside the body's limb, fading to
		// nothing at the shell's outer edge.
		float glow = pow(clamp(-dot(vNormal, vView), 0.0, 1.0), 2.2) * 2.2;
		gl_FragColor = vec4(uColor, glow * uOpacity);
	}
`;

/** Additive limb glow: the earth's atmosphere, the sun's corona. @param {THREE.Vector3} color */
function glowMaterial(color, opacity = 0) {
	return new THREE.ShaderMaterial({
		vertexShader: atmosphereVertex,
		fragmentShader: atmosphereFragment,
		uniforms: { uOpacity: { value: opacity }, uColor: { value: color } },
		side: THREE.BackSide,
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});
}

/** @param {number} count */
function createStars(count) {
	const positions = new Float32Array(count * 3);
	const sizes = new Float32Array(count);
	const appear = new Float32Array(count);
	const phase = new Float32Array(count);
	const colors = new Float32Array(count * 3);
	const tints = [
		[1, 1, 1],
		[0.75, 0.85, 1],
		[1, 0.9, 0.75]
	];

	for (let i = 0; i < count; i++) {
		// Uniform direction on a sphere, radius in a thick shell around the camera.
		const u = Math.random() * 2 - 1;
		const theta = Math.random() * Math.PI * 2;
		const r = 120 + Math.random() * 280;
		const s = Math.sqrt(1 - u * u);
		positions.set([r * s * Math.cos(theta), r * u, r * s * Math.sin(theta)], i * 3);
		sizes[i] = Math.random() < 0.04 ? 3 + Math.random() * 2 : 0.8 + Math.random() * 1.6;
		// Bias toward later appearance so the field keeps filling in slowly.
		appear[i] = Math.pow(Math.random(), 0.7) * STAR_SPREAD;
		phase[i] = Math.random();
		colors.set(tints[Math.floor(Math.random() * tints.length)], i * 3);
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
	geometry.setAttribute('aAppear', new THREE.BufferAttribute(appear, 1));
	geometry.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
	geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

	const material = new THREE.ShaderMaterial({
		vertexShader: starVertex,
		fragmentShader: starFragment,
		uniforms: {
			uTime: { value: 0 },
			uStart: { value: Infinity },
			uPixelRatio: { value: 1 }
		},
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	return new THREE.Points(geometry, material);
}

/**
 * Flat ring with UVs running along the radius, the way ring textures are laid out.
 * @param {import('./planets').PlanetDef} def @param {number} segments
 */
function ringGeometry(def, segments) {
	const ring = /** @type {NonNullable<typeof def.ring>} */ (def.ring);
	const inner = def.radius * ring.inner;
	const outer = def.radius * ring.outer;
	const geo = new THREE.RingGeometry(inner, outer, segments, 1);
	const pos = geo.attributes.position;
	const uv = geo.attributes.uv;
	const v = new THREE.Vector3();
	for (let i = 0; i < pos.count; i++) {
		v.fromBufferAttribute(pos, i);
		uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
	}
	return geo;
}

/** @param {THREE.Object3D} root */
function disposeTree(root) {
	root.traverse((obj) => {
		const mesh = /** @type {THREE.Mesh} */ (obj);
		if (!mesh.geometry) return;
		mesh.geometry.dispose();
		const mat = /** @type {THREE.Material & Record<string, any>} */ (mesh.material);
		for (const key of ['map', 'normalMap', 'specularMap', 'alphaMap']) mat[key]?.dispose();
		mat.dispose();
	});
}

/**
 * Builds the space scene on `canvas`: the whole solar system laid out at its
 * real positions for today, with the earth at the origin. Home stations frame
 * the earth; inner pages fly the camera to another body.
 *
 * Dragging on the earth, the moon or a planet rotates that body freely;
 * letting go keeps a little momentum. `onDragChange` reports when a drag
 * starts and ends so page-level touch navigation can ignore that gesture.
 *
 * Rendering resolution adapts to the measured frame rate. `onSlow` fires
 * (once) when even the lowest resolution can't keep up, or the GPU context
 * is lost, so the caller can fall back to something lighter.
 * @param {HTMLCanvasElement} canvas
 * @param {{
 *   tier?: 'high' | 'low',
 *   onDragChange?: (dragging: boolean) => void,
 *   onSlow?: () => void
 * }} [opts]
 */
export function createSpace(canvas, { tier = 'high', onDragChange, onSlow } = {}) {
	const quality = TIERS[tier];
	const TEXTURES = quality.textures;
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: quality.antialias,
		alpha: false,
		powerPreference: 'high-performance'
	});
	renderer.setClearColor(0x000000, 1);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	// Stars are drawn first from their own scene, so far planets always cover them.
	renderer.autoClear = false;

	const scene = new THREE.Scene();
	const starScene = new THREE.Scene();
	// Far enough to see across to Neptune.
	const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 12000);
	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

	// --- Solar system layout -------------------------------------------------

	const earthDef = /** @type {import('./planets').PlanetDef} */ (
		bodies.find((b) => b.id === 'earth')
	);
	// Turns heliocentric longitudes so the sun lands at SUN_BEARING from the earth.
	const turn = SUN_BEARING - longitude(earthDef);
	/** @param {import('./planets').PlanetDef} def */
	const heliocentric = (def) => {
		const a = longitude(def) + turn;
		return new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)).multiplyScalar(def.au * AU);
	};
	const earthHelio = heliocentric(earthDef);
	/** Scene position of `def`; the earth is the origin. @param {import('./planets').PlanetDef} def */
	const placeOf = (def) => heliocentric(def).sub(earthHelio);
	const sunPos = earthHelio.clone().negate();

	scene.add(new THREE.AmbientLight(0xffffff, 0.06));
	// No falloff: every planet gets the same sunlight, as the old directional light gave the earth.
	const sun = new THREE.PointLight(0xffffff, 2.4, 0, 0);
	sun.position.copy(sunPos);
	scene.add(sun);

	// Textures
	const manager = new THREE.LoadingManager();
	const loader = new THREE.TextureLoader(manager);
	const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), tier === 'high' ? 16 : 4);
	/** @param {string | null} url @param {boolean} [color] */
	const load = (url, color = true) => {
		if (!url) return null;
		const tex = loader.load(url);
		if (color) tex.colorSpace = THREE.SRGBColorSpace;
		tex.anisotropy = maxAniso;
		return tex;
	};
	/** @type {Promise<void>} */
	const ready = new Promise((resolve) => {
		manager.onLoad = () => resolve();
		manager.onError = () => resolve(); // never block the intro on a missing file
	});

	const seg = quality.segments;
	const specularMap = load(TEXTURES.earthSpecular, false);
	const earth = new THREE.Mesh(
		new THREE.SphereGeometry(EARTH_RADIUS, seg, seg),
		new THREE.MeshPhongMaterial({
			map: load(TEXTURES.earth),
			normalMap: load(TEXTURES.earthNormal, false),
			normalScale: new THREE.Vector2(0.85, 0.85),
			specularMap,
			// Without the map that keeps land matte, tone the glint down everywhere.
			specular: new THREE.Color(specularMap ? 0x333333 : 0x111111),
			shininess: 18,
			transparent: true,
			opacity: 0
		})
	);

	// handle (user drag rotation) > tilt (axial tilt) > earth + clouds (idle spin)
	const earthHandle = new THREE.Group();
	scene.add(earthHandle);
	const earthTilt = new THREE.Group();
	earthTilt.rotation.z = THREE.MathUtils.degToRad(earthDef.tilt);
	earthHandle.add(earthTilt);
	earthTilt.add(earth);
	earth.userData.handle = earthHandle;

	const clouds = new THREE.Mesh(
		new THREE.SphereGeometry(EARTH_RADIUS * 1.012, seg, seg),
		new THREE.MeshPhongMaterial({
			map: load(TEXTURES.clouds),
			transparent: true,
			opacity: 0,
			depthWrite: false
		})
	);
	earthTilt.add(clouds);

	const atmosphereMat = glowMaterial(new THREE.Vector3(0.35, 0.6, 1.0));
	const atmosphere = new THREE.Mesh(
		new THREE.SphereGeometry(EARTH_RADIUS * 1.15, seg / 1.5, seg / 1.5),
		atmosphereMat
	);
	scene.add(atmosphere);

	// The moon orbits on a tilted plane around the earth.
	const moonOrbit = new THREE.Group();
	moonOrbit.rotation.x = THREE.MathUtils.degToRad(12);
	moonOrbit.rotation.z = THREE.MathUtils.degToRad(-8);
	scene.add(moonOrbit);
	const moonPivot = new THREE.Group();
	moonPivot.rotation.y = -0.25; // start front-right of the earth
	moonOrbit.add(moonPivot);
	const moon = new THREE.Mesh(
		new THREE.SphereGeometry(MOON_RADIUS, seg / 1.5, seg / 1.5),
		new THREE.MeshStandardMaterial({
			map: load(TEXTURES.moon),
			roughness: 1,
			metalness: 0,
			transparent: true,
			opacity: 0
		})
	);
	// Same pattern as the earth: the handle takes drag rotation, the mesh spins.
	const moonHandle = new THREE.Group();
	moonHandle.position.x = MOON_ORBIT;
	moonPivot.add(moonHandle);
	moonHandle.add(moon);
	moon.userData.handle = moonHandle;

	const stars = createStars(quality.stars);
	starScene.add(stars);
	const starUniforms = /** @type {THREE.ShaderMaterial} */ (stars.material).uniforms;

	/** Momentum per body, in radians per second around world Y (x) and X (y). */
	const momentum = new Map([
		[earthHandle, { x: 0, y: 0 }],
		[moonHandle, { x: 0, y: 0 }]
	]);

	// --- Sun and planets -------------------------------------------------------

	/**
	 * Every body but the earth. Each is always in the scene as a flat-coloured,
	 * low-poly sphere; a textured one (`near`) replaces it only while the camera
	 * is close, and is freed again once it's far.
	 * @typedef {{
	 *   def: import('./planets').PlanetDef,
	 *   handle: THREE.Group,
	 *   tilt: THREE.Group,
	 *   spin: THREE.Group,
	 *   far: THREE.Mesh,
	 *   farRing: THREE.Mesh | null,
	 *   near: { group: THREE.Group, ready: boolean } | null,
	 *   glow: THREE.ShaderMaterial | null,
	 *   reach: number,
	 *   opacity: Damped,
	 *   shown: number
	 * }} Body
	 */

	// Hidden until the intro recedes, like the stars.
	const system = new THREE.Group();
	system.visible = false;
	scene.add(system);

	/** @param {import('./planets').PlanetDef} def @returns {Body} */
	function buildBody(def) {
		// handle (drag) > tilt (axial tilt) > spin (idle spin) > meshes
		const handle = new THREE.Group();
		handle.position.copy(placeOf(def));
		const tilt = new THREE.Group();
		tilt.rotation.z = THREE.MathUtils.degToRad(def.tilt);
		handle.add(tilt);
		const spin = new THREE.Group();
		tilt.add(spin);

		const color = new THREE.Color(def.color);
		const far = def.star
			? new THREE.Mesh(
					new THREE.SphereGeometry(def.radius, seg / 1.5, seg / 1.5),
					new THREE.MeshBasicMaterial({ color, transparent: true })
				)
			: new THREE.Mesh(
					new THREE.SphereGeometry(def.radius, 16, 12),
					new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, transparent: true })
				);
		far.userData.handle = handle;
		spin.add(far);

		let glow = null;
		if (def.star) {
			glow = glowMaterial(new THREE.Vector3(1, 0.75, 0.35), 1);
			handle.add(new THREE.Mesh(new THREE.SphereGeometry(def.radius * 1.6, 32, 32), glow));
		} else {
			momentum.set(handle, { x: 0, y: 0 });
		}

		let farRing = null;
		if (def.ring) {
			farRing = new THREE.Mesh(
				ringGeometry(def, 48),
				new THREE.MeshStandardMaterial({
					color,
					side: THREE.DoubleSide,
					roughness: 1,
					metalness: 0,
					transparent: true,
					opacity: 0.5,
					depthWrite: false
				})
			);
			farRing.rotation.x = -Math.PI / 2;
			tilt.add(farRing);
		}

		system.add(handle);
		return {
			def,
			handle,
			tilt,
			spin,
			far,
			farRing,
			near: null,
			glow,
			// Screen footprint: rings and the sun's glow reach past the sphere.
			reach: def.radius * (def.ring?.outer ?? (def.star ? 1.6 : 1)),
			opacity: new Damped(1, 4),
			shown: 1
		};
	}

	const solar = bodies.filter((def) => def.id !== 'earth').map(buildBody);

	/** Starts loading the textured version of `b`; it swaps in once loaded. @param {Body} b */
	function loadNear(b) {
		const { def } = b;
		if (!def.map || b.near) return;
		// Own loading manager: the swap happens only once all its textures arrive.
		const nearManager = new THREE.LoadingManager();
		const nearLoader = new THREE.TextureLoader(nearManager);
		/** @param {string} url @param {boolean} [color] */
		const tex = (url, color = true) => {
			const t = nearLoader.load(url);
			if (color) t.colorSpace = THREE.SRGBColorSpace;
			t.anisotropy = maxAniso;
			return t;
		};

		const group = new THREE.Group();
		group.visible = false;
		const body = new THREE.Mesh(
			new THREE.SphereGeometry(def.radius, seg / 1.5, seg / 1.5),
			new THREE.MeshStandardMaterial({
				map: tex(def.map),
				roughness: 1,
				metalness: 0,
				transparent: true,
				opacity: b.shown
			})
		);
		body.userData.handle = b.handle;
		group.add(body);
		b.spin.add(group);

		if (def.ring) {
			const ring = new THREE.Mesh(
				ringGeometry(def, 128),
				new THREE.MeshStandardMaterial({
					map: tex(def.ring.color),
					alphaMap: tex(def.ring.alpha, false),
					side: THREE.DoubleSide,
					roughness: 1,
					metalness: 0,
					transparent: true,
					opacity: b.shown,
					depthWrite: false
				})
			);
			ring.rotation.x = -Math.PI / 2;
			group.add(ring);
		}

		const near = { group, ready: false };
		b.near = near;
		nearManager.onLoad = () => {
			if (b.near !== near) return; // dropped before it finished loading
			near.ready = group.visible = true;
			b.far.visible = false;
			if (b.farRing) b.farRing.visible = false;
		};
	}

	/** Frees the textured version of `b`, back to the flat sphere. @param {Body} b */
	function dropNear(b) {
		if (!b.near) return;
		b.spin.remove(b.near.group);
		disposeTree(b.near.group);
		b.near = null;
		b.far.visible = true;
		if (b.farRing) b.farRing.visible = true;
	}

	/** Sets every material of `b` to opacity `o` (the far ring keeps its own see-through). @param {Body} b @param {number} o */
	function fadeBody(b, o) {
		/** @param {THREE.Object3D} obj @param {number} [base] */
		const set = (obj, base = 1) => {
			const mat = /** @type {THREE.Material} */ (/** @type {THREE.Mesh} */ (obj).material);
			if (mat) mat.opacity = o * base;
		};
		set(b.far);
		if (b.farRing) set(b.farRing, 0.5);
		if (b.glow) b.glow.uniforms.uOpacity.value = o;
		b.near?.group.children.forEach((m) => set(m));
	}

	/** On-screen boxes of the text and navigation over the canvas. @type {DOMRect[]} */
	let textRects = [];
	let textRectsAt = -Infinity;
	/** Re-reads `textRects`, at most every TEXT_REFRESH_MS. @param {number} now */
	function readTextRects(now) {
		if (now - textRectsAt < TEXT_REFRESH_MS) return;
		textRectsAt = now;
		textRects = [];
		for (const el of document.querySelectorAll(TEXT_SELECTOR)) {
			// Inactive home stations stay mounted, hidden and inert.
			if (el.closest('[aria-hidden="true"], [inert]')) continue;
			const r = el.getBoundingClientRect();
			if (r.width && r.height && r.bottom > 0 && r.top < window.innerHeight) textRects.push(r);
		}
	}

	const projected = new THREE.Vector3();
	/** True if `b`'s on-screen circle overlaps any text or navigation. @param {Body} b */
	function overText(b) {
		const depth = -projected.copy(b.handle.position).applyMatrix4(camera.matrixWorldInverse).z;
		// Wholly behind the camera: nothing on screen to overlap.
		if (depth <= -b.reach) return false;
		// Beside the camera (the sun from far-back stations): it spills across the
		// screen edge, where projecting its centre means nothing; assume it overlaps.
		if (depth <= b.reach) return textRects.length > 0;
		const r = (b.reach / depth) * focal;
		projected.copy(b.handle.position).project(camera);
		const x = ((projected.x + 1) / 2) * canvas.clientWidth;
		const y = ((1 - projected.y) / 2) * canvas.clientHeight;
		return textRects.some(
			(t) => x + r > t.left && x - r < t.right && y + r > t.top && y - r < t.bottom
		);
	}

	// --- Camera ---------------------------------------------------------------

	/**
	 * A camera placement. `reach` scales the pointer parallax with how far
	 * the camera stands from its subject.
	 * @typedef {{ pos: THREE.Vector3, quat: THREE.Quaternion, reach: number }} Shot
	 */

	const AXIS_X = new THREE.Vector3(1, 0, 0);
	const AXIS_Y = new THREE.Vector3(0, 1, 0);
	const lookM = new THREE.Matrix4();

	/** @param {THREE.Vector3} eye @param {THREE.Vector3} target @param {number} reach @returns {Shot} */
	function shot(eye, target, reach) {
		lookM.lookAt(eye, target, AXIS_Y);
		return { pos: eye, quat: new THREE.Quaternion().setFromRotationMatrix(lookM), reach };
	}

	/**
	 * Camera distance for the intro close-up. On narrow (portrait) screens the
	 * horizontal field of view shrinks, so back off until the earth spans
	 * about 60% of the width instead of overflowing it.
	 */
	function introDistance() {
		const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
		return Math.max(introPose.camera.z, (EARTH_RADIUS * 1.65) / halfWidth);
	}

	const introShot = () => shot(new THREE.Vector3(0, 0, introDistance()), new THREE.Vector3(), 1);

	/** A home station: frames the earth where the station puts it on screen. */
	function stationShot() {
		const s = stations[stationIndex];
		// On portrait screens the planets sit above the content instead of beside it.
		const portrait = aspect < 1;
		const gx = s.planets.x * (portrait ? 0.25 : 1);
		const gy = s.planets.y + (portrait ? 3 : 0);
		const cz = s.camera.z * (portrait ? 1.5 : 1);
		// Showing the earth smaller is the same as standing further back.
		const k = 1 / s.planets.scale;
		return shot(
			new THREE.Vector3((s.camera.x - gx) * k, (s.camera.y - gy) * k, cz * k),
			new THREE.Vector3(-gx * k, (s.camera.y - gy) * k, 0),
			k
		);
	}

	/** An inner page: the destination body in the top-right, seen from `approach`. @param {Body} b */
	function pageShot(b) {
		const p = b.handle.position;
		const r = b.def.radius;
		const framing = aspect < 1 ? PAGE_SHOT_PORTRAIT : PAGE_SHOT;
		const dist = r * framing.radii;
		// Start from the sunlit side (the sun itself: any side), then swing round.
		const dir = b.def.star ? AXIS_X.clone() : sunPos.clone().sub(p).setY(0).normalize();
		dir.applyAxisAngle(AXIS_Y, approach.yaw);
		dir.multiplyScalar(Math.cos(approach.pitch)).addScaledVector(AXIS_Y, Math.sin(approach.pitch));
		const eye = p.clone().addScaledVector(dir, dist);
		// Aim off the body so it lands at (x, y) on screen.
		lookM.lookAt(eye, p, AXIS_Y);
		const right = new THREE.Vector3().setFromMatrixColumn(lookM, 0);
		const up = new THREE.Vector3().setFromMatrixColumn(lookM, 1);
		const target = p
			.clone()
			.addScaledVector(right, -framing.x * dist)
			.addScaledVector(up, -framing.y * dist);
		return shot(eye, target, r / 2);
	}

	/** Where the camera should be right now. */
	function currentShot() {
		if (!started) return introShot();
		if (pageMode && destination) return pageShot(destination);
		return stationShot();
	}

	/** The camera's resting placement (before pointer parallax). @type {Shot} */
	const view = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), reach: 1 };
	/** @type {{ from: Shot, to: Shot, t: number, duration: number, arc: number } | null} */
	let flight = null;

	/** Flies from wherever the camera is now (mid-flight included) to `to`. @param {Shot} to */
	function flyTo(to) {
		const dist = view.pos.distanceTo(to.pos);
		if (reducedMotion) {
			jumpTo(to);
			return;
		}
		flight = {
			from: { pos: view.pos.clone(), quat: view.quat.clone(), reach: view.reach },
			to,
			t: 0,
			// Longer trips take longer, but only logarithmically: Neptune isn't a 30x wait.
			duration: FLIGHT_TIME + FLIGHT_TIME_PER_DECADE * Math.log10(1 + dist / 100),
			arc: dist * FLIGHT_ARC * THREE.MathUtils.smoothstep(dist, 30, 300)
		};
	}

	/** @param {Shot} to */
	function jumpTo(to) {
		flight = null;
		view.pos.copy(to.pos);
		view.quat.copy(to.quat);
		view.reach = to.reach;
	}

	/** @param {number} dt */
	function stepFlight(dt) {
		if (!flight) return;
		const { from, to } = flight;
		flight.t = Math.min(1, flight.t + dt / flight.duration);
		const s = easeInOut(flight.t);
		view.pos.lerpVectors(from.pos, to.pos, s);
		view.pos.y += flight.arc * Math.sin(Math.PI * s);
		view.quat.slerpQuaternions(from.quat, to.quat, s);
		view.reach = THREE.MathUtils.lerp(from.reach, to.reach, s);
		if (flight.t === 1) flight = null;
	}

	// Animated state. Opacity fades in over ~0.7 s.
	const earthOpacity = new Damped(0, 3.5);
	const moonOpacity = new Damped(0, 3.5);
	const pointer = { x: new Damped(0, 3), y: new Damped(0, 3) };

	let started = false;
	let stationIndex = 0;
	// An inner page is open: fly to the destination and render at half rate.
	let pageMode = false;
	/** The body the current inner page shows. @type {Body | null} */
	let destination = null;
	/** Angles the camera approaches `destination` from, picked per visit. */
	let approach = { yaw: 0, pitch: 0 };
	let frame = 0;
	let aspect = 1;
	/** Pixels per scene unit at distance 1, for on-screen sizes. */
	let focal = 1;

	// Resolution scale the frame-rate watchdog can lower, never above the tier's cap.
	let pixelCap = quality.maxPixelRatio;
	let slowReported = false;
	const reportSlow = () => {
		if (slowReported) return;
		slowReported = true;
		onSlow?.();
	};

	function resize() {
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		const dpr = Math.min(window.devicePixelRatio, pixelCap);
		renderer.setPixelRatio(dpr);
		renderer.setSize(w, h, false);
		aspect = w / h;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		focal = h / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
		starUniforms.uPixelRatio.value = dpr;
		// Reframe for the new shape without starting a trip; a flight in progress just lands there.
		const next = currentShot();
		if (flight) flight.to = next;
		else jumpTo(next);
	}

	// --- Drag to rotate -----------------------------------------------------

	const raycaster = new THREE.Raycaster();
	const ndc = new THREE.Vector2();
	/** @type {{ handle: THREE.Group, x: number, y: number, t: number } | null} */
	let drag = null;

	/** The body under the pointer, if any. @param {PointerEvent} e */
	function pick(e) {
		if (!started) return null;
		const rect = canvas.getBoundingClientRect();
		ndc.set(
			((e.clientX - rect.left) / rect.width) * 2 - 1,
			-((e.clientY - rect.top) / rect.height) * 2 + 1
		);
		raycaster.setFromCamera(ndc, camera);
		/** @type {THREE.Object3D[]} */
		const targets = [earth, moon];
		for (const b of solar) {
			if (b.def.star) continue;
			targets.push(b.near?.ready ? b.near.group.children[0] : b.far);
		}
		const hit = raycaster.intersectObjects(targets, false)[0];
		return hit ? /** @type {THREE.Group} */ (hit.object.userData.handle) : null;
	}

	const worldDelta = new THREE.Quaternion();
	const parentWorld = new THREE.Quaternion();
	const stepQ = new THREE.Quaternion();
	const screenX = new THREE.Vector3();
	const screenY = new THREE.Vector3();
	/**
	 * Rotates `obj` around screen-aligned axes, whatever its parents' rotation
	 * (the moon sits inside a tilted, orbiting pivot).
	 * @param {THREE.Object3D} obj @param {number} yaw @param {number} pitch
	 */
	function rotateWorld(obj, yaw, pitch) {
		// The camera's axes, so dragging works the same from any side of the system.
		screenY.copy(AXIS_Y).applyQuaternion(camera.quaternion);
		screenX.copy(AXIS_X).applyQuaternion(camera.quaternion);
		worldDelta.setFromAxisAngle(screenY, yaw).multiply(stepQ.setFromAxisAngle(screenX, pitch));
		/** @type {THREE.Object3D} */ (obj.parent).getWorldQuaternion(parentWorld);
		// Convert the world-space delta into the parent's frame: P⁻¹ · Δ · P
		const local = parentWorld.clone().invert().multiply(worldDelta).multiply(parentWorld);
		obj.quaternion.premultiply(local);
	}

	/** @param {PointerEvent} e */
	function onPointerDown(e) {
		if (e.target !== canvas || e.button !== 0) return;
		const handle = pick(e);
		if (!handle) return;
		e.preventDefault();
		drag = { handle, x: e.clientX, y: e.clientY, t: performance.now() };
		const m = /** @type {{ x: number, y: number }} */ (momentum.get(handle));
		m.x = m.y = 0;
		canvas.style.cursor = 'grabbing';
		onDragChange?.(true);
	}

	/** @param {PointerEvent} e */
	function onPointerMove(e) {
		if (drag) {
			const now = performance.now();
			const yaw = (e.clientX - drag.x) * DRAG_SENSITIVITY;
			const pitch = (e.clientY - drag.y) * DRAG_SENSITIVITY;
			rotateWorld(drag.handle, yaw, pitch);
			// Remember the latest speed so a flick keeps spinning after release.
			const dt = Math.max(now - drag.t, 1) / 1000;
			const m = /** @type {{ x: number, y: number }} */ (momentum.get(drag.handle));
			m.x = yaw / dt;
			m.y = pitch / dt;
			drag.x = e.clientX;
			drag.y = e.clientY;
			drag.t = now;
			return;
		}
		pointer.x.target = (e.clientX / window.innerWidth - 0.5) * 2;
		pointer.y.target = (e.clientY / window.innerHeight - 0.5) * 2;
		if (e.target === canvas) canvas.style.cursor = pick(e) ? 'grab' : '';
	}

	function onPointerUp() {
		if (!drag) return;
		// A pause before release means the user stopped: no momentum.
		if (performance.now() - drag.t > 80) {
			const m = /** @type {{ x: number, y: number }} */ (momentum.get(drag.handle));
			m.x = m.y = 0;
		}
		drag = null;
		canvas.style.cursor = 'grab';
		onDragChange?.(false);
	}

	// --- Frame-rate watchdog ---------------------------------------------------

	let lastFrame = 0;
	let watched = 0;
	let windowMs = 0;
	let windowFrames = 0;

	/** @param {number} time rAF timestamp, ms */
	function watchFrameRate(time) {
		const ms = time - lastFrame;
		lastFrame = time;
		// Hidden tabs pause rAF; the first frame back isn't a real measurement.
		if (!started || slowReported || ms > 250 || document.hidden) return;
		if (++watched <= FPS_WARMUP) return;
		windowMs += ms;
		if (++windowFrames < FPS_WINDOW) return;
		const fps = (1000 * windowFrames) / windowMs;
		windowMs = windowFrames = 0;
		if (fps >= TARGET_FPS) return;
		const dpr = renderer.getPixelRatio();
		if (dpr > MIN_PIXEL_RATIO) {
			pixelCap = Math.max(MIN_PIXEL_RATIO, dpr * 0.75);
			resize();
			watched = FPS_WARMUP - 30; // let the resized canvas settle before measuring again
		} else if (fps < MIN_FPS) {
			reportSlow();
		}
	}

	/** @param {Event} e */
	function onContextLost(e) {
		e.preventDefault();
		reportSlow();
	}

	canvas.style.touchAction = 'none';
	canvas.addEventListener('webglcontextlost', onContextLost);
	window.addEventListener('pointerdown', onPointerDown);
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('pointerup', onPointerUp);
	window.addEventListener('pointercancel', onPointerUp);

	const camRight = new THREE.Vector3();
	const camUp = new THREE.Vector3();
	const clock = new THREE.Clock();
	renderer.setAnimationLoop((time) => {
		watchFrameRate(time);
		// Parked behind an inner page the scene is ambient, so ~30 fps is plenty.
		if (pageMode && !flight && frame++ % 2) return;
		const dt = Math.min(clock.getDelta(), 0.1);
		const t = clock.elapsedTime;

		earth.rotation.y += dt * EARTH_SPIN;
		clouds.rotation.y += dt * CLOUD_SPIN;
		moonPivot.rotation.y += dt * MOON_ORBIT_SPEED;
		moon.rotation.y += dt * MOON_SPIN;

		const decay = Math.exp(-SPIN_DECAY * dt);
		for (const [handle, m] of momentum) {
			if (drag?.handle === handle || (!m.x && !m.y)) continue;
			rotateWorld(handle, m.x * dt, m.y * dt);
			m.x *= decay;
			m.y *= decay;
			if (Math.abs(m.x) + Math.abs(m.y) < 1e-3) m.x = m.y = 0;
		}

		const eo = earthOpacity.step(dt);
		const mo = moonOpacity.step(dt);
		/** @type {THREE.MeshPhongMaterial} */ (earth.material).opacity = eo;
		/** @type {THREE.MeshPhongMaterial} */ (clouds.material).opacity = eo * 0.85;
		atmosphereMat.uniforms.uOpacity.value = eo;
		/** @type {THREE.MeshStandardMaterial} */ (moon.material).opacity = mo;

		stepFlight(dt);
		const px = pointer.x.step(dt);
		const py = pointer.y.step(dt);
		camera.quaternion.copy(view.quat);
		camRight.copy(AXIS_X).applyQuaternion(view.quat);
		camUp.copy(AXIS_Y).applyQuaternion(view.quat);
		camera.position
			.copy(view.pos)
			.addScaledVector(camRight, px * 0.4 * view.reach)
			.addScaledVector(camUp, -py * 0.25 * view.reach);

		// From afar the earth is a dot: skip its see-through layers.
		clouds.visible = atmosphere.visible =
			(EARTH_RADIUS / camera.position.length()) * focal > LOD_FAR;

		for (const b of solar) {
			b.spin.rotation.y += dt * PLANET_SPIN;
			if (!b.def.map || b === destination) continue;
			const size = (b.def.radius / camera.position.distanceTo(b.handle.position)) * focal;
			// Bodies merely flown past stay flat; only stopping nearby loads textures.
			if (size > LOD_NEAR && !flight) loadNear(b);
			else if (size < LOD_FAR) dropNear(b);
		}

		// The page's own planet is the subject; any other body behind text or navigation fades.
		camera.updateMatrixWorld();
		readTextRects(time);
		for (const b of solar) {
			const subject = pageMode && b === destination;
			b.opacity.target = !subject && system.visible && overText(b) ? DIM_OPACITY : 1;
			const o = b.opacity.step(dt);
			if (Math.abs(o - b.shown) < 1e-3) continue;
			b.shown = o;
			fadeBody(b, o);
		}

		stars.position.copy(camera.position);
		starUniforms.uTime.value = t;
		renderer.clear();
		renderer.render(starScene, camera);
		renderer.render(scene, camera);
	});

	resize();

	return {
		/** Resolves once textures are loaded (or failed). */
		ready,
		resize,
		/** @param {import('./timeline').Phase} phase */
		setPhase(phase) {
			if (phase === 'earth' || phase === 'moon' || phase === 'ready') earthOpacity.target = 1;
			if (phase === 'moon' || phase === 'ready') moonOpacity.target = 1;
			if (phase === 'ready' && !started) {
				started = true;
				system.visible = true;
				starUniforms.uStart.value = clock.elapsedTime;
				flyTo(currentShot());
			}
		},
		/**
		 * Makes `def` the body inner pages fly to (or none), approached from a
		 * fresh random angle.
		 * @param {import('./planets').PlanetDef | null} def
		 */
		setPlanet(def) {
			const next = (def && solar.find((b) => b.def.id === def.id)) || null;
			if (next === destination) return;
			destination = next;
			if (next) {
				approach = {
					yaw: next.def.star ? Math.random() * Math.PI * 2 : (Math.random() * 2 - 1) * APPROACH_YAW,
					pitch: (0.15 + Math.random() * 0.35) * (Math.random() < 0.5 ? -1 : 1)
				};
				// Load during the flight so the textures are there on arrival.
				loadNear(next);
			}
			if (started && pageMode) flyTo(currentShot());
		},
		/** @param {boolean} on */
		setPage(on) {
			if (on === pageMode) return;
			pageMode = on;
			if (started) flyTo(currentShot());
		},
		/** @param {number} index */
		setStation(index) {
			if (index === stationIndex) return;
			stationIndex = index;
			if (started && !pageMode) flyTo(currentShot());
		},
		dispose() {
			canvas.removeEventListener('webglcontextlost', onContextLost);
			window.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
			window.removeEventListener('pointercancel', onPointerUp);
			renderer.setAnimationLoop(null);
			disposeTree(scene);
			disposeTree(starScene);
			renderer.dispose();
		}
	};
}
