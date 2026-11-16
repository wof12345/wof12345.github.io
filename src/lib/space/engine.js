import * as THREE from 'three';
import { introPose, stations } from './stations';

const TEXTURES = {
	earth: '/textures/earth_atmos_2048.jpg',
	earthNormal: '/textures/earth_normal_2048.jpg',
	earthSpecular: '/textures/earth_specular_2048.jpg',
	clouds: '/textures/earth_clouds_1024.png',
	moon: '/textures/moon_1024.jpg'
};

const EARTH_RADIUS = 1.6;
const MOON_RADIUS = 0.43;
const MOON_ORBIT = 3;
const STAR_COUNT = 4000;
// Camera/planet easing rate; lower = slower, softer travel between stations.
const TRAVEL_RATE = 1.1;
// Stars pop in over this window (seconds) once the recede starts.
const STAR_SPREAD = 6;

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

function createStars() {
	const positions = new Float32Array(STAR_COUNT * 3);
	const sizes = new Float32Array(STAR_COUNT);
	const appear = new Float32Array(STAR_COUNT);
	const phase = new Float32Array(STAR_COUNT);
	const colors = new Float32Array(STAR_COUNT * 3);
	const tints = [
		[1, 1, 1],
		[0.75, 0.85, 1],
		[1, 0.9, 0.75]
	];

	for (let i = 0; i < STAR_COUNT; i++) {
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
 * @param {HTMLCanvasElement} canvas
 */
export function createSpace(canvas) {
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
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
	const maxAniso = renderer.capabilities.getMaxAnisotropy();
	/** @param {string} url @param {boolean} [color] */
	const load = (url, color = true) => {
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

	const earth = new THREE.Mesh(
		new THREE.SphereGeometry(EARTH_RADIUS, 96, 96),
		new THREE.MeshPhongMaterial({
			map: load(TEXTURES.earth),
			normalMap: load(TEXTURES.earthNormal, false),
			normalScale: new THREE.Vector2(0.85, 0.85),
			specularMap: load(TEXTURES.earthSpecular, false),
			specular: new THREE.Color(0x333333),
			shininess: 18,
			transparent: true,
			opacity: 0
		})
	);
	earth.rotation.z = THREE.MathUtils.degToRad(23.4);
	planets.add(earth);

	const clouds = new THREE.Mesh(
		new THREE.SphereGeometry(EARTH_RADIUS * 1.012, 96, 96),
		new THREE.MeshPhongMaterial({
			map: load(TEXTURES.clouds),
			transparent: true,
			opacity: 0,
			depthWrite: false
		})
	);
	clouds.rotation.z = earth.rotation.z;
	planets.add(clouds);

	const atmosphereMat = new THREE.ShaderMaterial({
		vertexShader: atmosphereVertex,
		fragmentShader: atmosphereFragment,
		uniforms: { uOpacity: { value: 0 } },
		side: THREE.BackSide,
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});
	planets.add(new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS * 1.15, 64, 64), atmosphereMat));

	// The moon orbits on a tilted plane around the earth.
	const moonOrbit = new THREE.Group();
	moonOrbit.rotation.x = THREE.MathUtils.degToRad(12);
	moonOrbit.rotation.z = THREE.MathUtils.degToRad(-8);
	planets.add(moonOrbit);
	const moonPivot = new THREE.Group();
	moonPivot.rotation.y = -0.25; // start front-right of the earth
	moonOrbit.add(moonPivot);
	const moon = new THREE.Mesh(
		new THREE.SphereGeometry(MOON_RADIUS, 64, 64),
		new THREE.MeshStandardMaterial({
			map: load(TEXTURES.moon),
			roughness: 1,
			metalness: 0,
			transparent: true,
			opacity: 0
		})
	);
	moon.position.x = MOON_ORBIT;
	moonPivot.add(moon);

	const stars = createStars();
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
	let aspect = 1;

	function applyStation() {
		const s = stations[stationIndex];
		// On portrait screens the planets sit above the content instead of beside it.
		const portrait = aspect < 1;
		cam.x.target = s.camera.x;
		cam.y.target = s.camera.y;
		cam.z.target = s.camera.z * (portrait ? 1.5 : 1);
		group.x.target = s.planets.x * (portrait ? 0.25 : 1);
		group.y.target = s.planets.y + (portrait ? 3 : 0);
		group.scale.target = s.planets.scale;
	}

	function resize() {
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		const dpr = Math.min(window.devicePixelRatio, 2);
		renderer.setPixelRatio(dpr);
		renderer.setSize(w, h, false);
		aspect = w / h;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		starUniforms.uPixelRatio.value = dpr;
		if (started) applyStation();
	}

	/** @param {PointerEvent} e */
	function onPointer(e) {
		pointer.x.target = (e.clientX / window.innerWidth - 0.5) * 2;
		pointer.y.target = (e.clientY / window.innerHeight - 0.5) * 2;
	}
	window.addEventListener('pointermove', onPointer);

	const clock = new THREE.Clock();
	renderer.setAnimationLoop(() => {
		const dt = Math.min(clock.getDelta(), 0.1);
		const t = clock.elapsedTime;

		earth.rotation.y += dt * 0.06;
		clouds.rotation.y += dt * 0.085;
		moonPivot.rotation.y += dt * 0.08;
		moon.rotation.y += dt * 0.08; // tidally locked-ish

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
		/** @param {number} index */
		setStation(index) {
			stationIndex = index;
			if (started) applyStation();
		},
		dispose() {
			window.removeEventListener('pointermove', onPointer);
			renderer.setAnimationLoop(null);
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
