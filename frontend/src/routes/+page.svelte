<script>
	import Home from '$lib/layouts/Home.svelte';
	import About from '$lib/layouts/About.svelte';
</script>

<section
	id="home-space"
	class="site-section bg-primary-200 relative h-screen overflow-hidden"
	style="perspective: 2px;"
>
	<Home />

	<About />
</section>
