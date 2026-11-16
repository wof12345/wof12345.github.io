<script>
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { absoluteUrl, author, siteUrl } from '$lib/seo';
	import { tagline } from '$lib/data/builder';
	import SpaceCanvas from '$lib/space/SpaceCanvas.svelte';
	import StationDots from '$lib/space/StationDots.svelte';
	import { stations } from '$lib/space/stations';
	import { runIntro } from '$lib/space/timeline';
	import { stationNavigation } from '$lib/space/navigation';
	import Station from '$lib/layouts/space/Station.svelte';
	import HeroStation from '$lib/layouts/space/HeroStation.svelte';
	import BuilderStation from '$lib/layouts/space/BuilderStation.svelte';
	import ProjectsStation from '$lib/layouts/space/ProjectsStation.svelte';
	import AboutStation from '$lib/layouts/space/AboutStation.svelte';

	const personJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: author,
		url: siteUrl,
		image: absoluteUrl('/favicon.png'),
		jobTitle: 'Builder',
		description: tagline,
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Mymensingh',
			addressCountry: 'Bangladesh'
		},
		knowsAbout: ['AI agents', 'System design', 'Node.js', 'AWS', 'Svelte', 'Distributed systems']
	});

	const views = [HeroStation, BuilderStation, ProjectsStation, AboutStation];

	/** @type {import('$lib/space/timeline').Phase} */
	let phase = $state('blank');
	let station = $state(0);
	let ready = $derived(phase === 'ready');

	/** @type {HTMLElement} */
	let root;
	/** @type {(gate: Promise<void>) => void} */
	let startIntro;
	const assetsReady = new Promise((resolve) => (startIntro = resolve));

	// Deep links like /#projects start at (or jump to) that station.
	const stationFromHash = () => {
		const i = stations.findIndex((s) => `#${s.id}` === location.hash);
		if (i >= 0) station = i;
	};

	onMount(() => {
		stationFromHash();
		window.addEventListener('hashchange', stationFromHash);
		const html = document.documentElement;
		html.style.overflow = 'hidden';
		html.style.overscrollBehavior = 'none';

		const cancelIntro = runIntro((p) => (phase = p), {
			gate: assetsReady,
			reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
		});
		const cleanupNav = stationNavigation(root, {
			count: stations.length,
			get: () => station,
			set: (i) => (station = i),
			enabled: () => ready
		});

		return () => {
			window.removeEventListener('hashchange', stationFromHash);
			cancelIntro();
			cleanupNav();
			html.style.overflow = '';
			html.style.overscrollBehavior = '';
		};
	});
</script>

<Seo
	title="{author} — Builder"
	description="{author} builds AI agents, event-driven backends and the systems underneath them."
	canonical="/"
	type="profile"
	keywords={['Atif Bin Ferdous', 'builder', 'AI agents', 'system design', 'backend engineer']}
	jsonLd={personJsonLd}
/>

<main bind:this={root} class="fixed inset-0 overflow-hidden bg-black text-white">
	<SpaceCanvas {phase} {station} onready={(p) => startIntro(p)} />

	{#each views as View, i (stations[i].id)}
		<Station
			id={stations[i].id}
			active={ready && station === i}
			direction={Math.sign(i - station)}
			label={stations[i].label}
		>
			{#if i === 0}
				<View revealed={ready} />
			{:else}
				<View />
			{/if}
		</Station>
	{/each}

	{#if ready}
		<StationDots current={station} onselect={(i) => (station = i)} />
	{/if}
</main>
