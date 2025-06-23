<script>
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Planet from '$lib/components/Base/Planet.svelte';
	import Building from '$lib/components/Base/Building/Building.svelte';
	import DropInFromBottom from '$lib/components/Animated/Entity/DropInFromBottom.svelte';
	import { onMount } from 'svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Home from '$lib/layouts/Home.svelte';
	import Navigation from '$lib/layouts/Navigation.svelte';
</script>

<Navigation />

<section
	id="home-space"
	class="site-section bg-primary-200 relative h-screen overflow-hidden"
	style="perspective: 2px;"
>
	<!-- {#each Object.keys(planets) as planet, idx (idx)}
		<Planet
			randomizePos={false}
			class={`${getPlanetPosition(planet)}`}
			planet={planets[planet]}
			name={planet}
			seed={idx + 1}
		/>
	{/each} -->

	<Home />
</section>

<!-- <section id="home-space_to_home-earth-clouds" class="site-section h-[1000px] w-full"></section>

<section id="earth-sea-level" class="site-section relative h-[1000px] w-full bg-black"></section>

<section
	id="earth-sea-level_to_ground-level"
	class="site-section h-[1000px] w-full bg-white"
></section>

<section id="ground-level" class="site-section h-[1000px] w-full bg-black"></section> -->
