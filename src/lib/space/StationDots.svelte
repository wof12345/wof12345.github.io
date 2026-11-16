<script>
	import { stations } from './stations';

	/** @type {{ current: number, onselect: (i: number) => void }} */
	let { current, onselect } = $props();
</script>

<nav
	aria-label="Sections"
	class="fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-4 sm:right-8"
>
	{#each stations as s, i (s.id)}
		<button
			type="button"
			onclick={() => onselect(i)}
			aria-label={s.label}
			aria-current={i === current ? 'step' : undefined}
			class="group flex items-center justify-end gap-3"
		>
			<span
				class="text-xs tracking-[0.25em] text-white/70 uppercase opacity-0 transition-opacity group-hover:opacity-100 {i ===
				current
					? 'sm:opacity-100'
					: ''}"
			>
				{s.label}
			</span>
			<span
				class="block rounded-full transition-all duration-500 {i === current
					? 'size-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
					: 'size-1.5 bg-white/40 group-hover:bg-white/80'}"
			></span>
		</button>
	{/each}
</nav>
