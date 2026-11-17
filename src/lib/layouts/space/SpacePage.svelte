<script>
	import { IconArrowLeft } from '@tabler/icons-svelte';
	import { page } from '$app/state';

	/**
	 * Frame for inner pages (about, blog, company, project). The 3D scene in
	 * the root layout stays mounted behind it; this only adds a reading scrim,
	 * a small nav, and the fade + staggered reveal when the page mounts. The
	 * empty margins pass pointer events through, so the planet behind the page
	 * can still be dragged.
	 *
	 * Children opt into the stagger with `data-reveal` + `--i` (see app.css).
	 * `revealKey` replays the reveal when a page swaps its content in place
	 * (e.g. next/previous company).
	 *
	 * @type {{
	 *   back?: { href: string, label: string },
	 *   width?: 'narrow' | 'wide',
	 *   revealKey?: unknown,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { back, width = 'narrow', revealKey, children } = $props();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/#experience', label: 'Experience' },
		{ href: '/about', label: 'About' },
		{ href: '/blog', label: 'Blog' }
	];
	/** @param {string} href */
	const isCurrent = (href) =>
		href !== '/' && !href.includes('#') && page.url.pathname.startsWith(href);

	let revealed = $state(false);
	$effect(() => {
		revealKey;
		revealed = false;
		// Two frames: let the hidden state paint before transitioning in.
		let frame = requestAnimationFrame(() => {
			frame = requestAnimationFrame(() => (revealed = true));
		});
		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	class="pointer-events-none relative z-10 min-h-dvh text-white transition-opacity duration-700"
	class:revealed
	style:opacity={revealed ? 1 : 0}
	style:--reveal-base="150ms"
	style:--reveal-step="110ms"
>
	<!-- Reading scrim: darkens the scene behind text without hiding it. -->
	<div
		class="pointer-events-none fixed inset-0 -z-10"
		style:background="radial-gradient(120% 90% at 85% 10%, rgb(0 0 0 / 0.15), rgb(0 0 0 / 0.7) 60%)"
	></div>

	<nav
		class="pointer-events-auto mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 pt-8 {width ===
		'wide'
			? 'max-w-5xl'
			: 'max-w-3xl'}"
	>
		{#if back}
			<a
				href={back.href}
				class="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-white/50 uppercase transition-colors hover:text-white"
			>
				<IconArrowLeft size={16} />
				{back.label}
			</a>
		{:else}
			<span></span>
		{/if}
		<ul class="flex flex-wrap gap-x-4 gap-y-2 text-xs tracking-[0.2em] uppercase sm:gap-x-6">
			{#each links as l (l.href)}
				<li>
					<a
						href={l.href}
						aria-current={isCurrent(l.href) ? 'page' : undefined}
						class="transition-colors hover:text-white {isCurrent(l.href)
							? 'text-white'
							: 'text-white/40'}"
					>
						{l.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div
		class="pointer-events-auto mx-auto px-6 pt-10 pb-24 sm:pt-14 md:pt-20 {width === 'wide'
			? 'max-w-5xl'
			: 'max-w-3xl'}"
	>
		{@render children()}
	</div>
</div>
