<script>
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
	 *
	 * @type {{
	 *   id: string,
	 *   label: string,
	 *   active: boolean,
	 *   position: number,
	 *   travel: number,
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
		base = 600,
		step = 140,
		onreveal,
		children
	} = $props();

	/** @type {HTMLElement} */
	let el;
	let seen = $state(false);
	let revealFrom = $state(1);
	// True while the first reveal plays; inner scroll areas hide their
	// scrollbar meanwhile, since the sliding children briefly overflow.
	let revealing = $state(false);
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let revealTimer;

	$effect(() => {
		if (!active || seen) return;
		revealFrom = travel;
		seen = true;
		revealing = true;
		const last = Math.max(
			0,
			...[...el.querySelectorAll('[data-reveal]')].map(
				(n) => Number(getComputedStyle(n).getPropertyValue('--i')) || 0
			)
		);
		const duration = base + last * step + REVEAL_MS;
		revealTimer = setTimeout(() => (revealing = false), duration);
		onreveal?.(duration);
	});
	$effect(() => () => clearTimeout(revealTimer));
</script>

<section
	bind:this={el}
	{id}
	aria-label={label}
	aria-hidden={!active}
	inert={!active}
	class="pointer-events-none fixed inset-0 z-20 flex items-center pr-12 pl-6 sm:px-16 lg:px-24"
	class:revealed={seen}
	class:revealing
	style:opacity={active ? 1 : 0}
	style:transform="translateY({active ? 0 : Math.sign(position) * 10}vh)"
	style:transition={active
		? 'opacity 900ms ease 450ms, transform 1100ms cubic-bezier(0.2, 0.7, 0.2, 1) 450ms'
		: 'opacity 500ms ease, transform 700ms cubic-bezier(0.5, 0, 0.75, 0)'}
	style:--reveal-from="{revealFrom * 32}px"
	style:--reveal-base="{base}ms"
	style:--reveal-step="{step}ms"
>
	<!-- Empty space passes clicks through to the planets; see .station-content in app.css. -->
	<div class="station-content w-full">
		{@render children()}
	</div>
</section>
