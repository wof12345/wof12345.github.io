/**
 * The solar system the scene is built from. Every body is always there, at
 * its real heliocentric longitude for today (circular orbits, mean motion
 * from J2000), so the map matches the sky. Page changes only fly the camera
 * to one of them.
 *
 * Scale: planet radii keep their true ratios (earth is 1.6 scene units);
 * orbits are compressed to AU scene units per astronomical unit, and the
 * sun is shrunk so it fits inside Mercury's orbit.
 *
 * @typedef {Object} PlanetDef
 * @property {string} id
 * @property {string} name     as shown in the "Passing …" caption
 * @property {number} radius   scene units (earth is 1.6)
 * @property {number} tilt     axial tilt, degrees
 * @property {number} au       orbit radius, astronomical units
 * @property {number} L0       mean longitude at J2000, degrees
 * @property {number} rate     mean motion, degrees per day
 * @property {string} color    flat colour used while far away / before the texture loads
 * @property {string} [map]    equirectangular surface texture, loaded only up close
 * @property {boolean} [star]  self-lit (the sun)
 * @property {{ color: string, alpha: string, inner: number, outer: number }} [ring]
 *   ring textures + radii as multiples of the planet radius
 */

const DIR = '/textures/planets';

/** Scene units per astronomical unit. */
export const AU = 120;

/** @type {PlanetDef[]} */
export const bodies = [
	{
		id: 'sun',
		name: 'the Sun',
		radius: 24,
		tilt: 7,
		au: 0,
		L0: 0,
		rate: 0,
		color: '#ffd27a',
		star: true
	},
	{
		id: 'mercury',
		name: 'Mercury',
		map: `${DIR}/mercurymap.jpg`,
		radius: 0.61,
		tilt: 0,
		au: 0.387,
		L0: 252.25,
		rate: 4.09233,
		color: '#9a9188'
	},
	{
		id: 'venus',
		name: 'Venus',
		map: `${DIR}/venusmap.jpg`,
		radius: 1.52,
		tilt: 177,
		au: 0.723,
		L0: 181.98,
		rate: 1.60213,
		color: '#d9b98a'
	},
	// Rendered by the engine itself (with clouds, atmosphere and the moon).
	{
		id: 'earth',
		name: 'Earth',
		radius: 1.6,
		tilt: 23.4,
		au: 1,
		L0: 100.46,
		rate: 0.98561,
		color: '#3a6fb0'
	},
	{
		id: 'mars',
		name: 'Mars',
		map: `${DIR}/marsmap1k.jpg`,
		radius: 0.85,
		tilt: 25,
		au: 1.524,
		L0: 355.43,
		rate: 0.52403,
		color: '#b5562f'
	},
	{
		id: 'jupiter',
		name: 'Jupiter',
		map: `${DIR}/jupitermap.jpg`,
		radius: 17.9,
		tilt: 3,
		au: 5.203,
		L0: 34.35,
		rate: 0.08309,
		color: '#c8a27c'
	},
	{
		id: 'saturn',
		name: 'Saturn',
		map: `${DIR}/saturnmap.jpg`,
		radius: 15.1,
		tilt: 27,
		au: 9.537,
		L0: 50.08,
		rate: 0.03346,
		color: '#d8c08c',
		ring: {
			color: `${DIR}/saturnringcolor.jpg`,
			alpha: `${DIR}/saturnringpattern.gif`,
			inner: 1.25,
			outer: 2.3
		}
	},
	{
		id: 'uranus',
		name: 'Uranus',
		map: `${DIR}/uranusmap.jpg`,
		radius: 6.4,
		tilt: 98,
		au: 19.19,
		L0: 314.06,
		rate: 0.01172,
		color: '#9fd3dc'
	},
	{
		id: 'neptune',
		name: 'Neptune',
		map: `${DIR}/neptunemap.jpg`,
		radius: 6.2,
		tilt: 28,
		au: 30.07,
		L0: 304.35,
		rate: 0.00598,
		color: '#4a6fd8'
	}
];

/** Bodies an inner page can fly to: everything but home. */
export const destinations = bodies.filter((b) => b.id !== 'earth');

const J2000 = Date.UTC(2000, 0, 1, 12);

/**
 * Heliocentric ecliptic longitude of `body` at `date`, radians.
 * @param {PlanetDef} body @param {number} [date] ms since epoch
 */
export function longitude(body, date = Date.now()) {
	const days = (date - J2000) / 86_400_000;
	return ((body.L0 + body.rate * days) * Math.PI) / 180;
}

/**
 * A random destination, never the same as `previous` so consecutive pages differ.
 * @param {string | null} [previous]
 */
export function randomPlanet(previous) {
	const pool = destinations.filter((p) => p.id !== previous);
	return pool[Math.floor(Math.random() * pool.length)];
}
