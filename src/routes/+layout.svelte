<script>
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/state';
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import SpaceCanvas from '$lib/space/SpaceCanvas.svelte';
	import { scene } from '$lib/space/scene.svelte';
	import { runIntro } from '$lib/space/timeline';
	import { quietScrollbars } from '$lib/space/quietScrollbars';
	import { randomPlanet } from '$lib/space/planets';

	let { children } = $props();

	// Routes that render on their own, without the space scene behind them.
	const STANDALONE = ['/cv', '/demo'];
	let pathname = $derived(page.url.pathname);
	let inSpace = $derived(!STANDALONE.some((p) => pathname === p || pathname.startsWith(`${p}/`)));
	let isHome = $derived(pathname === '/');

	// Every inner-page visit gets its own random planet behind it.
	/** @type {import('$lib/space/planets').PlanetDef | null} */
	let planet = $state(null);
	$effect(() => {
		if (isHome || !inSpace) {
			planet = null;
			return;
		}
		pathname; // re-pick on each inner-page navigation
		planet = randomPlanet(untrack(() => planet?.id));
	});

	/** @type {(gate: Promise<void>) => void} */
	let startIntro;
	const assetsReady = new Promise((resolve) => (startIntro = resolve));

	onMount(() => {
		tabVisibleState.set(document.visibilityState === 'visible');
		const onVisibility = () => tabVisibleState.set(document.visibilityState === 'visible');
		document.addEventListener('visibilitychange', onVisibility);

		// The full cinematic intro only plays when the visit starts on the home
		// page. Landing on an inner page fades the planets straight into the
		// background so the content isn't kept waiting.
		const cancelIntro = runIntro((p) => (scene.phase = p), {
			gate: assetsReady,
			reducedMotion:
				matchMedia('(prefers-reduced-motion: reduce)').matches || page.url.pathname !== '/'
		});

		const html = document.documentElement;
		html.classList.add('quiet-scrollbars');
		const cleanupScrollbars = quietScrollbars();

		return () => {
			document.removeEventListener('visibilitychange', onVisibility);
			cancelIntro();
			cleanupScrollbars();
			html.classList.remove('quiet-scrollbars');
		};
	});
</script>

<ParaglideJS {i18n}>
	{#if inSpace}
		<!-- Mounted once and kept across inner pages, so travelling never reloads the scene. -->
		<SpaceCanvas
			phase={scene.phase}
			station={scene.station}
			page={!isHome}
			{planet}
			onready={(p) => startIntro(p)}
			ondragchange={(d) => (scene.dragging = d)}
		/>
		{#if planet}
			{#key planet.id}
				<p
					class="planet-caption pointer-events-none fixed right-6 bottom-6 z-20 hidden sm:block text-[10px] tracking-[0.4em] text-white/35 uppercase"
				>
					Passing {planet.name}
				</p>
			{/key}
		{/if}
	{/if}
	{@render children()}
</ParaglideJS>
