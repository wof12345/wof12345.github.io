<script>
	import { onMount, untrack } from 'svelte';

	// Matches the `[data-reveal]` transition duration in app.css.
	const REVEAL_MS = 900;

	/**
	 * Full-screen overlay for one station.
	 *
	 * Movement follows travel direction: stations already passed sit above,
	 * stations ahead sit below. Scrolling down, the old content leaves upward
	 * and the new content rises in; scrolling up, both move down.
	 *
	 * The first time a station becomes active, its `[data-reveal]` children
	 * animate in one after another (`--i` sets the order). `onreveal` receives
	 * how long that takes so the caller can hold navigation until it ends.
	 * `revealedBefore` skips that reveal (the visitor already saw it on an
	 * earlier visit to the home page).
	 *
	 * `fit` marks content sized to one screen: it never scrolls, and on phones
	 * it sits at the bottom, leaving the top of the screen to the planets.
	 *
	 * @type {{
	 *   id: string,
	 *   label: string,
	 *   active: boolean,
	 *   position: number,
	 *   travel: number,
	 *   revealedBefore?: boolean,
	 *   fit?: boolean,
	 *   base?: number,
	 *   step?: number,
	 *   onreveal?: (ms: number) => void,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let {
		id,
		label,
		active,
		position,
		travel,
		revealedBefore = false,
		fit = false,
		base = 600,
		step = 140,
		onreveal,
		children
	} = $props();

	/** @type {HTMLElement} */
	let el;
	let seen = $state(untrack(() => revealedBefore));
	// Becomes true a frame after mount, so a station that is already active
	// (e.g. coming back from an inner page) still fades in instead of popping.
	let mounted = $state(false);
	let shown = $derived(active && mounted);
	onMount(() => {
		const frame = requestAnimationFrame(() => (mounted = true));
		return () => cancelAnimationFrame(frame);
	});
	let revealFrom = $state(1);

	$effect(() => {
		if (!active || seen) return;
		revealFrom = travel;
		seen = true;
		const last = Math.max(
			0,
			...[...el.querySelectorAll('[data-reveal]')].map(
				(n) => Number(getComputedStyle(n).getPropertyValue('--i')) || 0
			)
		);
		onreveal?.(base + last * step + REVEAL_MS);
	});
</script>

<section
	bind:this={el}
	{id}
	aria-label={label}
	aria-hidden={!active}
	inert={!active}
	data-scrollable={fit ? undefined : true}
	class="pointer-events-none fixed inset-0 z-20 flex pr-12 pl-6 sm:px-16 lg:px-24 {fit
		? 'overflow-hidden'
		: 'overflow-y-auto'}"
	class:revealed={seen}
	style:opacity={shown ? 1 : 0}
	style:transform="translateY({shown ? 0 : Math.sign(position || 1) * 10}vh)"
	style:transition={shown
		? 'opacity 900ms ease 450ms, transform 1100ms cubic-bezier(0.2, 0.7, 0.2, 1) 450ms'
		: 'opacity 500ms ease, transform 700ms cubic-bezier(0.5, 0, 0.75, 0)'}
	style:--reveal-from="{revealFrom * 32}px"
	style:--reveal-base="{base}ms"
	style:--reveal-step="{step}ms"
>
	<!-- Empty space passes clicks through to the planets; see .station-content in app.css.
	     `my-auto` centres the content but, unlike `items-center`, lets content taller
	     than a phone screen scroll instead of being cut off at both ends. -->
	<div class="station-content w-full sm:my-auto sm:py-8 {fit ? 'mt-auto pb-10' : 'my-auto py-12'}">
		{@render children()}
	</div>
</section>
