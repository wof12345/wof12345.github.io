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

	/** @type {import('$lib/space/timeline').Phase} */
	let phase = $state('blank');
	let station = $state(0);
	// Direction of the last move: 1 = forward (down), -1 = back (up).
	let travel = $state(1);
	let ready = $derived(phase === 'ready');

	// Navigation stays locked while travelling and while a station plays its
	// first-visit reveal.
	let lockedUntil = 0;
	/** @param {number} ms */
	const lock = (ms) => (lockedUntil = Math.max(lockedUntil, performance.now() + ms));
	const canNavigate = () => ready && performance.now() >= lockedUntil;

	/** @param {number} i */
	function navigate(i) {
		if (!canNavigate() || i === station) return;
		travel = i > station ? 1 : -1;
		station = i;
		lock(TRAVEL_MS);
	}

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
			set: navigate,
			enabled: canNavigate
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
			label={stations[i].label}
			active={ready && station === i}
			position={i - station}
			{travel}
			{...revealTiming[stations[i].id]}
			onreveal={lock}
		>
			<View />
		</Station>
	{/each}

	{#if ready}
		<StationDots current={station} onselect={navigate} />
	{/if}
</main>
