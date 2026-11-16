<script>
	import { stations } from './stations';

	/** @type {{ current: number, onselect: (i: number) => void }} */
	let { current, onselect } = $props();

	const ROW = 36; // px per dot row
	const R = 9; // ring radius
	const LINE = 10; // traveling line length
	const CIRC = 2 * Math.PI * R;
	// The line travels first, then the ring draws around the target.
	const TRAVEL_MS = 650;
	const RING_MS = 550;

	/** @param {number} i */
	const center = (i) => i * ROW + ROW / 2;

	/** @type {HTMLElement} */
	let line;
	let prev = current;
	let from = current;
	// Which side of the target the line arrives on: 1 = top (moving down), -1 = bottom.
	let arriving = $state(1);
	let moved = $state(false);

	// Runs before the DOM updates so the new ring renders with the right start angle.
	$effect.pre(() => {
		if (current === prev) return;
		from = prev;
		arriving = current > prev ? 1 : -1;
		moved = true;
		prev = current;
	});

	$effect(() => {
		const to = current;
		if (!moved || !line) return;
		const dir = to > from ? 1 : -1;
		// Leave from the edge of the old ring, stop at the edge of the new one.
		const start = dir > 0 ? center(from) + R : center(from) - R - LINE;
		const end = dir > 0 ? center(to) - R - LINE : center(to) + R;
		const mid = (start + end) / 2;
		const anim = line.animate(
			[
				{ top: `${start}px`, height: `${LINE}px`, opacity: 0 },
				{ opacity: 1, offset: 0.1 },
				{ top: `${dir > 0 ? mid : mid - LINE}px`, height: `${LINE * 2.5}px`, offset: 0.5 },
				{ top: `${end}px`, height: `${LINE}px`, opacity: 1, offset: 0.92 },
				{ top: `${end}px`, height: `${LINE}px`, opacity: 0 }
			],
			{ duration: TRAVEL_MS, easing: 'cubic-bezier(0.6, 0, 0.3, 1)', fill: 'forwards' }
		);
		return () => anim.cancel();
	});
</script>

<nav
	aria-label="Sections"
	class="fixed top-1/2 right-3 z-40 -translate-y-1/2 sm:right-8"
	style:height="{stations.length * ROW}px"
>
	<div class="relative h-full w-6">
		<!-- faint track -->
		<span
			class="absolute left-1/2 w-px -translate-x-1/2 bg-white/10"
			style:top="{center(0)}px"
			style:bottom="{ROW / 2}px"
		></span>

		<span
			bind:this={line}
			class="absolute left-1/2 w-px -translate-x-1/2 bg-white opacity-0 shadow-[0_0_6px_rgba(255,255,255,0.9)]"
		></span>

		{#key current}
			<svg
				class="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
				style:top="{center(current)}px"
				width={R * 2 + 2}
				height={R * 2 + 2}
				viewBox="0 0 {R * 2 + 2} {R * 2 + 2}"
				aria-hidden="true"
			>
				<circle
					class="ring"
					cx={R + 1}
					cy={R + 1}
					r={R}
					fill="none"
					stroke="white"
					stroke-width="1"
					stroke-dasharray={CIRC}
					stroke-dashoffset={CIRC}
					transform="rotate({arriving > 0 ? -90 : 90} {R + 1} {R + 1})"
					style:animation-delay="{moved ? TRAVEL_MS * 0.85 : 200}ms"
					style:animation-duration="{RING_MS}ms"
				/>
			</svg>
		{/key}

		{#each stations as s, i (s.id)}
			<button
				type="button"
				onclick={() => onselect(i)}
				aria-label={s.label}
				aria-current={i === current ? 'step' : undefined}
				class="group absolute left-0 flex w-6 items-center justify-center"
				style:top="{i * ROW}px"
				style:height="{ROW}px"
			>
				<span
					class="pointer-events-none absolute right-9 text-xs tracking-[0.25em] whitespace-nowrap text-white/70 uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 {i ===
					current
						? 'sm:opacity-100'
						: ''}"
					style:transition-delay={i === current ? `${TRAVEL_MS + RING_MS * 0.5}ms` : '0ms'}
				>
					{s.label}
				</span>
				<span
					class="block size-1.5 rounded-full transition-all duration-500"
					class:bg-white={i === current}
					class:bg-white-40={i !== current}
					style:transition-delay={i === current ? `${TRAVEL_MS}ms` : '0ms'}
					style:box-shadow={i === current ? '0 0 10px rgba(255,255,255,0.8)' : 'none'}
				></span>
			</button>
		{/each}
	</div>
</nav>

<style>
	.ring {
		animation-name: draw;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		animation-fill-mode: forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	.bg-white-40 {
		background: rgb(255 255 255 / 0.4);
	}
</style>
