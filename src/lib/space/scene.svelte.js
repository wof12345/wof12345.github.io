/**
 * Scene state shared between the root layout (which owns the 3D canvas and
 * the intro) and the pages rendered over it. It outlives page navigations,
 * so returning home lands on the same station without replaying reveals.
 */
export const scene = $state({
	/** @type {import('./timeline').Phase} */
	phase: 'blank',
	/** Current home station index. */
	station: 0,
	/** Direction of the last station move: 1 = forward (down), -1 = back (up). */
	travel: 1,
	/** True while the visitor is dragging a planet. */
	dragging: false,
	/** Station ids whose first-visit reveal has already played. @type {Record<string, boolean>} */
	seen: {}
});
