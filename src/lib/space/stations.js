/**
 * Fixed points in space the visitor moves between.
 *
 * `camera.z` is the camera distance; `planets` places the earth+moon group.
 * Each step pushes the planets further away so they recede into the
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
	{
		id: 'builder',
		label: 'Builder',
		camera: { x: 0, y: 0.5, z: 17 },
		planets: { x: 9, y: 4, scale: 0.8 }
	},
	{
		id: 'projects',
		label: 'Projects',
		camera: { x: 0, y: 1, z: 26 },
		planets: { x: 14, y: 8.5, scale: 0.6 }
	},
	{
		id: 'about',
		label: 'About',
		camera: { x: 0, y: 1.5, z: 38 },
		planets: { x: 15, y: 9, scale: 0.4 }
	}
];

/** Camera/planet placement during the intro, before the recede. */
export const introPose = {
	camera: { x: 0, y: 0, z: 6 },
	planets: { x: 0, y: 0, scale: 1 }
};
