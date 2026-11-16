// How long the scrollbar stays visible after the last scroll event.
const VISIBLE_MS = 900;

/**
 * Shows a scroll area's scrollbar only while it is being scrolled, by
 * toggling `is-scrolling` (styled in app.css). Page scrolls mark <html>.
 * @returns {() => void} cleanup
 */
export function quietScrollbars() {
	/** @type {Map<Element, ReturnType<typeof setTimeout>>} */
	const timers = new Map();

	/** @param {Event} e */
	function onScroll(e) {
		const el = e.target instanceof Element ? e.target : document.documentElement;
		el.classList.add('is-scrolling');
		clearTimeout(timers.get(el));
		timers.set(
			el,
			setTimeout(() => {
				el.classList.remove('is-scrolling');
				timers.delete(el);
			}, VISIBLE_MS)
		);
	}

	// Scroll events don't bubble, so listen in the capture phase.
	document.addEventListener('scroll', onScroll, { capture: true, passive: true });
	return () => {
		document.removeEventListener('scroll', onScroll, { capture: true });
		timers.forEach(clearTimeout);
	};
}
