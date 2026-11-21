/**
 * Fixed points in space the visitor moves between.
 *
 * Earth sits fixed at the origin of the solar system map, so these describe
 * the shot rather than moving anything: `camera.z` is the camera distance,
 * and `planets` is where the earth+moon appear on screen (offset, and size
 * via `scale`). Each step frames them further away so they recede into the
 * background as the visitor travels.
 *
 * @typedef {Object} Station
 * @property {string} id
 * @property {string} label
 * @property {{ x: number, y: number, z: number }} camera
 * @property {{ x: number, y: number, scale: number }} planets
 */

/** @type {Station[]} */
export const stations = [
	{
		id: 'home',
		label: 'Home',
		camera: { x: 0, y: 0, z: 11 },
		planets: { x: 3.2, y: -0.3, scale: 1 }
	},
	// Builder station hidden for now; restore together with BuilderStation in +page.svelte.
	// {
	// 	id: 'builder',
	// 	label: 'Builder',
	// 	camera: { x: 0, y: 0.5, z: 17 },
	// 	planets: { x: 9, y: 4, scale: 0.8 }
	// },
	{
		id: 'experience',
		label: 'Experience',
		camera: { x: 0, y: 0.8, z: 23 },
		planets: { x: 12, y: 6.5, scale: 0.7 }
	},
	{
		id: 'projects',
		label: 'Projects',
		camera: { x: 0, y: 1, z: 30 },
		planets: { x: 15, y: 9.5, scale: 0.55 }
	},
	{
		id: 'about',
		label: 'About',
		camera: { x: 0, y: 1.5, z: 40 },
		planets: { x: 17, y: 11, scale: 0.4 }
	}
];

/** Camera/planet placement during the intro, before the recede. */
export const introPose = {
	camera: { x: 0, y: 0, z: 6 },
	planets: { x: 0, y: 0, scale: 1 }
};
