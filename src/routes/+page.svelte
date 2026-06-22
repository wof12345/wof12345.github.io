<script>
	import Home from '$lib/layouts/Home.svelte';
	import Projects from '$lib/layouts/Projects.svelte';
	import About from '$lib/layouts/About.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { absoluteUrl, author, defaultDescription, siteUrl } from '$lib/seo';

	const personJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: author,
		url: siteUrl,
		image: absoluteUrl('/favicon.png'),
		jobTitle: 'Full-Stack Software Engineer',
		description: defaultDescription,
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Mymensingh',
			addressCountry: 'Bangladesh'
		},
		knowsAbout: [
			'Software Engineering',
			'Svelte',
			'SvelteKit',
			'TypeScript',
			'JavaScript',
			'Tailwind CSS',
			'Web Development',
			'Full-Stack Development'
		]
	});
</script>

<Seo
	title="Atif Bin Ferdous — Full-Stack Software Engineer"
	description="Portfolio of Atif Bin Ferdous, a full-stack software engineer building fast, accessible web apps with Svelte, SvelteKit, TypeScript, and Tailwind CSS."
	canonical="/"
	type="profile"
	keywords={[
		'Atif Bin Ferdous portfolio',
		'hire software engineer',
		'Svelte developer',
		'SvelteKit developer',
		'full-stack engineer Bangladesh'
	]}
	jsonLd={personJsonLd}
/>

<main class="bg-primary-950 min-h-screen w-full overflow-x-clip text-white">
	<Home />
	<Projects />
	<About />
</main>
