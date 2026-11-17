import * as THREE from 'three';
import { introPose, pagePose, stations } from './stations';

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
// Camera/planet easing rate; lower = slower, softer travel between stations.
const TRAVEL_RATE = 1.1;
// Idle motion, in radians per second. Kept slow so the scene feels calm.
const EARTH_SPIN = 0.012;
const CLOUD_SPIN = 0.017;
const MOON_ORBIT_SPEED = 0.015;
const MOON_SPIN = 0.015;
// Drag: radians per pixel, and how fast a flick's momentum dies off.
const DRAG_SENSITIVITY = 0.006;
const SPIN_DECAY = 2.5;
// The random planet shown behind inner pages.
const PLANET_POS = { x: 13, y: 6, z: 8 };
const PLANET_SPIN = 0.02;
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
	varying vec3 vNormal;
	varying vec3 vView;
	void main() {
		// Back faces: brightest just outside the earth's limb, fading to
		// nothing at the shell's outer edge.
		float glow = pow(clamp(-dot(vNormal, vView), 0.0, 1.0), 2.2) * 2.2;
		gl_FragColor = vec4(vec3(0.35, 0.6, 1.0), glow * uOpacity);
	}
`;

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
		// Uniform direction on a sphere, radius in a thick shell around the scene.
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
 * Builds the space scene on `canvas`.
 *
 * Dragging on the earth or the moon rotates that body freely; letting go
 * keeps a little momentum. `onDragChange` reports when a drag starts and
 * ends so page-level touch navigation can ignore that gesture.
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

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

	scene.add(new THREE.AmbientLight(0xffffff, 0.06));
	const sun = new THREE.DirectionalLight(0xffffff, 2.4);
	sun.position.set(-6, 2, 5);
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

	// Earth + moon live in one group so stations can move/scale them together.
	const planets = new THREE.Group();
	scene.add(planets);

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
	planets.add(earthHandle);
	const earthTilt = new THREE.Group();
	earthTilt.rotation.z = THREE.MathUtils.degToRad(23.4);
	earthHandle.add(earthTilt);
	earthTilt.add(earth);

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

	const atmosphereMat = new THREE.ShaderMaterial({
		vertexShader: atmosphereVertex,
		fragmentShader: atmosphereFragment,
		uniforms: { uOpacity: { value: 0 } },
		side: THREE.BackSide,
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});
	planets.add(
		new THREE.Mesh(
			new THREE.SphereGeometry(EARTH_RADIUS * 1.15, seg / 1.5, seg / 1.5),
			atmosphereMat
		)
	);

	// The moon orbits on a tilted plane around the earth.
	const moonOrbit = new THREE.Group();
	moonOrbit.rotation.x = THREE.MathUtils.degToRad(12);
	moonOrbit.rotation.z = THREE.MathUtils.degToRad(-8);
	planets.add(moonOrbit);
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

	const stars = createStars(quality.stars);
	scene.add(stars);
	const starUniforms = /** @type {THREE.ShaderMaterial} */ (stars.material).uniforms;

	// Animated state. Opacity fades in over ~0.7 s, travel eases over ~2 s.
	const earthOpacity = new Damped(0, 3.5);
	const moonOpacity = new Damped(0, 3.5);
	const cam = {
		x: new Damped(introPose.camera.x, TRAVEL_RATE),
		y: new Damped(introPose.camera.y, TRAVEL_RATE),
		z: new Damped(introPose.camera.z, TRAVEL_RATE)
	};
	const group = {
		x: new Damped(introPose.planets.x, TRAVEL_RATE),
		y: new Damped(introPose.planets.y, TRAVEL_RATE),
		scale: new Damped(introPose.planets.scale, TRAVEL_RATE)
	};
	const pointer = { x: new Damped(0, 3), y: new Damped(0, 3) };

	let started = false;
	let stationIndex = 0;
	// An inner page is open: use the page pose and render at half rate.
	let pageMode = false;
	let frame = 0;
	let aspect = 1;

	function applyStation() {
		const s = pageMode ? pagePose : stations[stationIndex];
		// On portrait screens the planets sit above the content instead of beside it.
		const portrait = aspect < 1;
		cam.x.target = s.camera.x;
		cam.y.target = s.camera.y;
		cam.z.target = s.camera.z * (portrait ? 1.5 : 1);
		group.x.target = s.planets.x * (portrait ? 0.25 : 1);
		group.y.target = s.planets.y + (portrait ? 3 : 0);
		group.scale.target = s.planets.scale;
	}

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
		starUniforms.uPixelRatio.value = dpr;
		if (started) applyStation();
		if (current) placePlanet(current);
	}

	// --- Drag to rotate -----------------------------------------------------

	const raycaster = new THREE.Raycaster();
	const ndc = new THREE.Vector2();
	/** Momentum per body, in radians per second around world Y (x) and X (y). */
	const momentum = new Map([
		[earthHandle, { x: 0, y: 0 }],
		[moonHandle, { x: 0, y: 0 }]
	]);
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
		const bodies = [earth, moon];
		if (current?.ready) bodies.push(current.body);
		const hit = raycaster.intersectObjects(bodies, false)[0];
		if (!hit) return null;
		if (hit.object === moon) return moonHandle;
		if (current && hit.object === current.body) return current.handle;
		return earthHandle;
	}

	const worldDelta = new THREE.Quaternion();
	const parentWorld = new THREE.Quaternion();
	const stepQ = new THREE.Quaternion();
	const AXIS_X = new THREE.Vector3(1, 0, 0);
	const AXIS_Y = new THREE.Vector3(0, 1, 0);
	/**
	 * Rotates `obj` around screen-aligned world axes, whatever its parents'
	 * rotation (the moon sits inside a tilted, orbiting pivot).
	 * @param {THREE.Object3D} obj @param {number} yaw @param {number} pitch
	 */
	function rotateWorld(obj, yaw, pitch) {
		worldDelta.setFromAxisAngle(AXIS_Y, yaw).multiply(stepQ.setFromAxisAngle(AXIS_X, pitch));
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

	// --- Page planet ------------------------------------------------------------

	/**
	 * @typedef {{
	 *   id: string,
	 *   handle: THREE.Group,
	 *   body: THREE.Mesh,
	 *   materials: THREE.Material[],
	 *   opacity: Damped,
	 *   ready: boolean,
	 *   dispose: () => void
	 * }} PagePlanet
	 */
	/** @type {PagePlanet | null} */
	let current = null;
	/** Planets fading out after a page change; disposed once invisible. @type {PagePlanet[]} */
	const leaving = [];

	/** @param {PagePlanet} p */
	function placePlanet(p) {
		const portrait = aspect < 1;
		p.handle.position.set(
			// Portrait has no free margin: tuck it into the top-right corner, partly off-screen.
			portrait ? 7 : PLANET_POS.x,
			PLANET_POS.y + (portrait ? 10 : 0),
			PLANET_POS.z
		);
	}

	/** @param {import('./planets').PlanetDef} def */
	function buildPlanet(def) {
		// Own loading manager: the planet fades in only once its textures arrive.
		const planetManager = new THREE.LoadingManager();
		const planetLoader = new THREE.TextureLoader(planetManager);
		/** @param {string} url @param {boolean} [color] */
		const tex = (url, color = true) => {
			const t = planetLoader.load(url);
			if (color) t.colorSpace = THREE.SRGBColorSpace;
			t.anisotropy = maxAniso;
			return t;
		};

		// handle (drag) > tilt (axial tilt, tipped toward the camera) > body (spin)
		const handle = new THREE.Group();
		const tilt = new THREE.Group();
		tilt.rotation.z = THREE.MathUtils.degToRad(def.tilt);
		tilt.rotation.x = 0.3;
		handle.add(tilt);

		const bodyMat = new THREE.MeshStandardMaterial({
			map: tex(def.map),
			roughness: 1,
			metalness: 0,
			transparent: true,
			opacity: 0
		});
		const body = new THREE.Mesh(
			new THREE.SphereGeometry(def.radius, seg / 1.5, seg / 1.5),
			bodyMat
		);
		tilt.add(body);
		/** @type {THREE.Material[]} */
		const materials = [bodyMat];

		if (def.ring) {
			const inner = def.radius * def.ring.inner;
			const outer = def.radius * def.ring.outer;
			const geo = new THREE.RingGeometry(inner, outer, 128, 1);
			// RingGeometry maps UVs across a plane; ring textures run along the radius.
			const pos = geo.attributes.position;
			const uv = geo.attributes.uv;
			const v = new THREE.Vector3();
			for (let i = 0; i < pos.count; i++) {
				v.fromBufferAttribute(pos, i);
				uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
			}
			const ringMat = new THREE.MeshStandardMaterial({
				map: tex(def.ring.color),
				alphaMap: tex(def.ring.alpha, false),
				side: THREE.DoubleSide,
				roughness: 1,
				metalness: 0,
				transparent: true,
				opacity: 0,
				depthWrite: false
			});
			const ring = new THREE.Mesh(geo, ringMat);
			ring.rotation.x = -Math.PI / 2;
			tilt.add(ring);
			materials.push(ringMat);
		}

		/** @type {PagePlanet} */
		const p = {
			id: def.id,
			handle,
			body,
			materials,
			opacity: new Damped(0, 2.5),
			ready: false,
			dispose() {
				scene.remove(handle);
				momentum.delete(handle);
				handle.traverse((obj) => {
					const mesh = /** @type {THREE.Mesh} */ (obj);
					if (!mesh.geometry) return;
					mesh.geometry.dispose();
					const mat = /** @type {THREE.MeshStandardMaterial} */ (mesh.material);
					mat.map?.dispose();
					mat.alphaMap?.dispose();
					mat.dispose();
				});
			}
		};
		planetManager.onLoad = () => {
			p.ready = true;
			if (current === p) p.opacity.target = 1;
		};
		placePlanet(p);
		scene.add(handle);
		momentum.set(handle, { x: 0, y: 0 });
		return p;
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

	const clock = new THREE.Clock();
	renderer.setAnimationLoop((time) => {
		watchFrameRate(time);
		// Behind an inner page the scene is ambient, so ~30 fps is plenty.
		if (pageMode && frame++ % 2) return;
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

		planets.position.set(group.x.step(dt), group.y.step(dt), 0);
		planets.scale.setScalar(group.scale.step(dt));

		const px = pointer.x.step(dt);
		const py = pointer.y.step(dt);
		camera.position.set(cam.x.step(dt) + px * 0.4, cam.y.step(dt) - py * 0.25, cam.z.step(dt));
		camera.lookAt(px * 0.15, cam.y.value - py * 0.1, 0);

		for (const p of current ? [current, ...leaving] : leaving) {
			const o = p.opacity.step(dt);
			for (const m of p.materials) m.opacity = o;
			p.body.rotation.y += dt * PLANET_SPIN;
		}
		for (let i = leaving.length - 1; i >= 0; i--) {
			if (leaving[i].opacity.value > 0.01) continue;
			leaving[i].dispose();
			leaving.splice(i, 1);
		}

		starUniforms.uTime.value = t;
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
				starUniforms.uStart.value = clock.elapsedTime;
				applyStation();
			}
		},
		/**
		 * Shows `def` as the page planet (or none), fading out the previous one.
		 * @param {import('./planets').PlanetDef | null} def
		 */
		setPlanet(def) {
			if ((current?.id ?? null) === (def?.id ?? null)) return;
			if (current) {
				current.opacity.target = 0;
				leaving.push(current);
			}
			current = def ? buildPlanet(def) : null;
		},
		/** @param {boolean} on */
		setPage(on) {
			pageMode = on;
			if (started) applyStation();
		},
		/** @param {number} index */
		setStation(index) {
			stationIndex = index;
			if (started) applyStation();
		},
		dispose() {
			canvas.removeEventListener('webglcontextlost', onContextLost);
			window.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
			window.removeEventListener('pointercancel', onPointerUp);
			renderer.setAnimationLoop(null);
			current?.dispose();
			leaving.forEach((p) => p.dispose());
			scene.traverse((obj) => {
				const mesh = /** @type {THREE.Mesh} */ (obj);
				if (!mesh.geometry) return;
				mesh.geometry.dispose();
				const mat = /** @type {THREE.Material & Record<string, any>} */ (mesh.material);
				for (const key of ['map', 'normalMap', 'specularMap']) mat[key]?.dispose();
				mat.dispose();
			});
			renderer.dispose();
		}
	};
}
