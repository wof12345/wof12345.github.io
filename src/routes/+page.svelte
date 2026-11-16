<script>
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { absoluteUrl, author, siteUrl } from '$lib/seo';
	import { tagline } from '$lib/data/builder';
	import StationDots from '$lib/space/StationDots.svelte';
	import { stations } from '$lib/space/stations';
	import { stationNavigation } from '$lib/space/navigation';
	import { scene } from '$lib/space/scene.svelte';
	import Station from '$lib/layouts/space/Station.svelte';
	import HeroStation from '$lib/layouts/space/HeroStation.svelte';
	import BuilderStation from '$lib/layouts/space/BuilderStation.svelte';
	import ExperienceStation from '$lib/layouts/space/ExperienceStation.svelte';
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

	const views = [HeroStation, BuilderStation, ExperienceStation, ProjectsStation, AboutStation];
	// The hero is the intro's last act, so it reveals slower than the rest.
	/** @type {Record<string, { base: number, step: number }>} */
	const revealTiming = { home: { base: 200, step: 320 } };

	// Minimum time between stations: the content swap plus most of the camera ease.
	const TRAVEL_MS = 1500;

	// The canvas and intro live in the root layout; station state is shared
	// through `scene` so it survives trips to inner pages.
	let ready = $derived(scene.phase === 'ready');

	// Navigation stays locked while travelling and while a station plays its
	// first-visit reveal.
	let lockedUntil = 0;
	/** @param {number} ms */
	const lock = (ms) => (lockedUntil = Math.max(lockedUntil, performance.now() + ms));
	const canNavigate = () => ready && performance.now() >= lockedUntil;

	/** @param {number} i */
	function navigate(i) {
		if (!canNavigate() || i === scene.station) return;
		scene.travel = i > scene.station ? 1 : -1;
		scene.station = i;
		lock(TRAVEL_MS);
	}

	/** @type {HTMLElement} */
	let root;

	// Deep links like /#projects start at (or jump to) that station.
	const stationFromHash = () => {
		const i = stations.findIndex((s) => `#${s.id}` === location.hash);
		if (i >= 0) scene.station = i;
	};

	onMount(() => {
		stationFromHash();
		window.addEventListener('hashchange', stationFromHash);
		const html = document.documentElement;
		html.style.overflow = 'hidden';
		html.style.overscrollBehavior = 'none';

		const cleanupNav = stationNavigation(root, {
			count: stations.length,
			get: () => scene.station,
			set: navigate,
			enabled: canNavigate,
			ignoreTouch: () => scene.dragging
		});

		return () => {
			window.removeEventListener('hashchange', stationFromHash);
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

<main bind:this={root} class="fixed inset-0 overflow-hidden text-white">
	{#each views as View, i (stations[i].id)}
		<Station
			id={stations[i].id}
			label={stations[i].label}
			active={ready && scene.station === i}
			position={i - scene.station}
			travel={scene.travel}
			revealedBefore={scene.seen[stations[i].id]}
			{...revealTiming[stations[i].id]}
			onreveal={(ms) => {
				scene.seen[stations[i].id] = true;
				lock(ms);
			}}
		>
			<View />
		</Station>
	{/each}

	{#if ready}
		<StationDots current={scene.station} onselect={navigate} />
	{/if}
</main>
