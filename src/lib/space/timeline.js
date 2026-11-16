/** Intro timings in ms from page entry. Single source for the sequence. */
export const timeline = {
	earthIn: 500,
	moonIn: 750,
	// ~700 ms after the moon appears both planets recede.
	recede: 1450
};

/**
 * Intro phases, in order:
 * - blank:  nothing visible
 * - earth:  earth visible
 * - moon:   earth + moon visible
 * - ready:  planets receded, stars + foreground in, navigation enabled
 * @typedef {'blank' | 'earth' | 'moon' | 'ready'} Phase
 */

/**
 * Runs the intro, calling `onPhase` at each step. `gate` delays the first
 * visible phase until assets are ready, so the earth never shows untextured.
 * @param {(phase: Phase) => void} onPhase
 * @param {{ gate?: Promise<unknown>, reducedMotion?: boolean }} [opts]
 * @returns {() => void} cancel
 */
export function runIntro(onPhase, { gate = Promise.resolve(), reducedMotion = false } = {}) {
	/** @type {ReturnType<typeof setTimeout>[]} */
	const timers = [];
	let cancelled = false;
	const start = performance.now();

	gate.then(() => {
		if (cancelled) return;
		if (reducedMotion) {
			onPhase('ready');
			return;
		}
		// Keep the timings relative to entry, but never earlier than "now".
		const elapsed = performance.now() - start;
		const at = (/** @type {number} */ ms, /** @type {Phase} */ phase) =>
			timers.push(setTimeout(() => onPhase(phase), Math.max(0, ms - elapsed)));
		const lag = Math.max(0, elapsed - timeline.earthIn);
		at(timeline.earthIn + lag, 'earth');
		at(timeline.moonIn + lag, 'moon');
		at(timeline.recede + lag, 'ready');
	});

	return () => {
		cancelled = true;
		timers.forEach(clearTimeout);
	};
}
