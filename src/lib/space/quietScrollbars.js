// How long the indicator stays visible after the last scroll event.
const VISIBLE_MS = 900;
// Indicator thickness, inset from the edge, and minimum length, in px.
const SIZE = 3;
const INSET = 4;
const MIN_LENGTH = 28;

/**
 * Overlay scroll indicators. Native scrollbars are hidden in app.css (so the
 * page never shifts when one appears); instead, while an area scrolls, a thin
 * thumb fades in over its edge and fades out shortly after scrolling stops.
 *
 * Covers the page itself and every `[data-scrollable]` area. Thumbs live in
 * <body> as fixed elements, positioned from the scroller's on-screen rect, so
 * transformed ancestors (the station overlays) can't misplace them.
 *
 * @returns {() => void} cleanup
 */
export function quietScrollbars() {
	/** @type {Map<Element, { thumb: HTMLElement, timer?: ReturnType<typeof setTimeout> }>} */
	const active = new Map();

	/**
	 * Positions `thumb` along `el`'s scroll edge.
	 * @param {Element} el @param {HTMLElement} thumb
	 */
	function place(el, thumb) {
		const isPage = el === document.scrollingElement;
		const rect = isPage
			? { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }
			: el.getBoundingClientRect();
		const vertical = el.scrollHeight - el.clientHeight > 1;
		const scrollMax = vertical
			? el.scrollHeight - el.clientHeight
			: el.scrollWidth - el.clientWidth;

		const track = (vertical ? rect.bottom - rect.top : rect.right - rect.left) - INSET * 2;
		const ratio = vertical ? el.clientHeight / el.scrollHeight : el.clientWidth / el.scrollWidth;
		const length = Math.max(MIN_LENGTH, track * ratio);
		const offset = ((vertical ? el.scrollTop : el.scrollLeft) / scrollMax) * (track - length);

		const s = thumb.style;
		if (vertical) {
			s.top = `${rect.top + INSET + offset}px`;
			s.left = `${rect.right - INSET - SIZE}px`;
			s.width = `${SIZE}px`;
			s.height = `${length}px`;
		} else {
			s.top = `${rect.bottom - INSET - SIZE}px`;
			s.left = `${rect.left + INSET + offset}px`;
			s.width = `${length}px`;
			s.height = `${SIZE}px`;
		}
	}

	/** @param {Event} e */
	function onScroll(e) {
		const el = e.target instanceof Element ? e.target : document.scrollingElement;
		if (!el) return;
		if (el !== document.scrollingElement && !el.matches('[data-scrollable]')) return;
		// Programmatic scrolls (e.g. hash jumps) can fire on areas with nothing to scroll.
		const scrollable = el.scrollHeight - el.clientHeight > 1 || el.scrollWidth - el.clientWidth > 1;
		if (!scrollable) return;

		let entry = active.get(el);
		if (!entry) {
			const thumb = document.createElement('div');
			thumb.className = 'scroll-thumb';
			thumb.setAttribute('aria-hidden', 'true');
			document.body.append(thumb);
			entry = { thumb };
			active.set(el, entry);
			// Start hidden, then fade in on the next frame.
			requestAnimationFrame(() => entry?.thumb.classList.add('is-visible'));
		} else {
			entry.thumb.classList.add('is-visible');
		}
		place(el, entry.thumb);

		clearTimeout(entry.timer);
		const current = entry;
		current.timer = setTimeout(() => {
			current.thumb.classList.remove('is-visible');
			// Remove after the fade, unless scrolling resumed meanwhile.
			current.timer = setTimeout(() => {
				current.thumb.remove();
				active.delete(el);
			}, 400);
		}, VISIBLE_MS);
	}

	// Scroll events don't bubble, so listen in the capture phase.
	document.addEventListener('scroll', onScroll, { capture: true, passive: true });
	return () => {
		document.removeEventListener('scroll', onScroll, { capture: true });
		for (const { thumb, timer } of active.values()) {
			clearTimeout(timer);
			thumb.remove();
		}
		active.clear();
	};
}
