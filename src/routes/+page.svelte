<script>
	import Home from '$lib/layouts/Home.svelte';
	import About from '$lib/layouts/About.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import Projects from '$lib/layouts/Projects.svelte';
	import Contact from '$lib/layouts/Contact.svelte';
</script>

<section id="home-space" class="site-section relative h-screen overflow-hidden" style="">
	<Home />

	<Projects />

	<About />

	<!-- <Contact /> -->
</section>
