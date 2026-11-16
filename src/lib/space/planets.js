/**
 * Planets that can appear behind inner pages, one picked at random per page
 * visit. Textures load lazily, only for the planet actually shown.
 *
 * @typedef {Object} PlanetDef
 * @property {string} id
 * @property {string} name
 * @property {string} map      equirectangular surface texture
 * @property {number} radius   scene units (earth is 1.6)
 * @property {number} tilt     axial tilt, degrees
 * @property {{ color: string, alpha: string, inner: number, outer: number }} [ring]
 *   ring textures + radii as multiples of the planet radius
 */

const DIR = '/textures/planets';

/** @type {PlanetDef[]} */
export const planets = [
	{ id: 'mercury', name: 'Mercury', map: `${DIR}/mercurymap.jpg`, radius: 1.2, tilt: 0 },
	{ id: 'venus', name: 'Venus', map: `${DIR}/venusmap.jpg`, radius: 1.7, tilt: 3 },
	{ id: 'mars', name: 'Mars', map: `${DIR}/marsmap1k.jpg`, radius: 1.4, tilt: 25 },
	{ id: 'jupiter', name: 'Jupiter', map: `${DIR}/jupitermap.jpg`, radius: 2.6, tilt: 3 },
	{
		id: 'saturn',
		name: 'Saturn',
		map: `${DIR}/saturnmap.jpg`,
		radius: 2,
		tilt: 27,
		ring: {
			color: `${DIR}/saturnringcolor.jpg`,
			alpha: `${DIR}/saturnringpattern.gif`,
			inner: 1.25,
			outer: 2.3
		}
	},
	{ id: 'uranus', name: 'Uranus', map: `${DIR}/uranusmap.jpg`, radius: 1.9, tilt: 98 },
	{ id: 'neptune', name: 'Neptune', map: `${DIR}/neptunemap.jpg`, radius: 1.9, tilt: 28 }
];

/**
 * A random planet, never the same as `previous` so consecutive pages differ.
 * @param {string | null} [previous]
 */
export function randomPlanet(previous) {
	const pool = planets.filter((p) => p.id !== previous);
	return pool[Math.floor(Math.random() * pool.length)];
}
