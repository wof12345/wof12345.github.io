const WHEEL_THRESHOLD = 60;
const SWIPE_THRESHOLD = 50;
// Matches the camera travel time so trackpad inertia can't skip stations.
const LOCK_MS = 1000;

/**
 * True if `target` sits inside a [data-scrollable] element that can still
 * scroll in `direction` — that element scrolls instead of the station.
 * @param {EventTarget | null} target
 * @param {1 | -1} direction
 */
function canScrollInside(target, direction) {
	const el = target instanceof Element ? target.closest('[data-scrollable]') : null;
	if (!el) return false;
	if (direction > 0) return el.scrollTop + el.clientHeight < el.scrollHeight - 1;
	return el.scrollTop > 0;
}

/**
 * Turns wheel / touch / key input into station steps.
 * @param {HTMLElement} root
 * @param {{ count: number, get: () => number, set: (i: number) => void, enabled: () => boolean }} opts
 * @returns {() => void} cleanup
 */
export function stationNavigation(root, { count, get, set, enabled }) {
	let lockedUntil = 0;
	let wheelAccum = 0;
	let touchY = /** @type {number | null} */ (null);

	/** @param {number} index */
	const go = (index) => {
		const next = Math.max(0, Math.min(count - 1, index));
		if (next === get()) return;
		lockedUntil = performance.now() + LOCK_MS;
		set(next);
	};
	/** @param {1 | -1} dir */
	const step = (dir) => go(get() + dir);
	const locked = () => !enabled() || performance.now() < lockedUntil;

	/** @param {WheelEvent} e */
	function onWheel(e) {
		const dir = e.deltaY > 0 ? 1 : -1;
		if (canScrollInside(e.target, dir)) return;
		e.preventDefault();
		if (locked()) {
			wheelAccum = 0;
			return;
		}
		wheelAccum += e.deltaY;
		if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
			wheelAccum = 0;
			step(dir);
		}
	}

	/** @param {TouchEvent} e */
	function onTouchStart(e) {
		touchY = e.touches[0].clientY;
	}
	/** @param {TouchEvent} e */
	function onTouchEnd(e) {
		if (touchY === null) return;
		const dy = touchY - e.changedTouches[0].clientY;
		touchY = null;
		const dir = dy > 0 ? 1 : -1;
		if (Math.abs(dy) < SWIPE_THRESHOLD || locked() || canScrollInside(e.target, dir)) return;
		step(dir);
	}

	/** @param {KeyboardEvent} e */
	function onKey(e) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		/** @type {Record<string, () => void>} */
		const keys = {
			ArrowDown: () => step(1),
			PageDown: () => step(1),
			' ': () => step(1),
			ArrowUp: () => step(-1),
			PageUp: () => step(-1),
			Home: () => go(0),
			End: () => go(count - 1)
		};
		const action = keys[e.key];
		if (!action) return;
		const dir = e.key === 'ArrowUp' || e.key === 'PageUp' ? -1 : 1;
		if (canScrollInside(e.target, dir)) return;
		e.preventDefault();
		if (!locked()) action();
	}

	root.addEventListener('wheel', onWheel, { passive: false });
	root.addEventListener('touchstart', onTouchStart, { passive: true });
	root.addEventListener('touchend', onTouchEnd);
	window.addEventListener('keydown', onKey);

	return () => {
		root.removeEventListener('wheel', onWheel);
		root.removeEventListener('touchstart', onTouchStart);
		root.removeEventListener('touchend', onTouchEnd);
		window.removeEventListener('keydown', onKey);
	};
}
