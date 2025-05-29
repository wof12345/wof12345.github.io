<script>
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Star from '$lib/components/Base/Star.svelte';
	import { generateRandomNumber } from '$lib/utils/number.js';
	import Planet from '$lib/components/Base/Planet.svelte';
	import { onMount } from 'svelte';

	let planets = {
		mercury: { class: `top-[45%] left-[55%] scale-[50%] z-[21]` },
		venus: { class: `top-[20%] left-[50%] scale-[100%]` },
		earth: { class: `top-[50%] left-[58%] scale-[100%] z-[22]` },
		mars: { class: `top-[50%] left-[40%] scale-[90%]` },
		jupiter: { class: `top-[76%] left-[44%] scale-[150%]` },
		saturn: { class: `top-[80%] left-[60%] scale-[90%]` },
		uranus: { class: `top-[20%] left-[40%] scale-[110%]` },
		neptune: { class: `top-[10%] left-[70%] scale-[110%]` },
		sun: { class: `top-[50%] left-[50%] scale-[300%]` }
	};

	function getPlanetPosition(planet) {
		// let posClass = `top-[${10 * idx}px] left-[${10 * idx}px]`;
		let posClass = planets[planet].class;

		return posClass;
	}

	let lastScrollY = 0;
	let scrollDirection = 'down';

	const scrollToSeaLevel = () => {
		const target = document.getElementById('earth-sea-level');
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	};

	onMount(() => {
		const handleScroll = (e) => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY) {
				scrollDirection = 'down';
			} else if (currentScrollY < lastScrollY) {
				scrollDirection = 'up';
			}
			lastScrollY = currentScrollY;

			console.log('Scroll Y:', currentScrollY);
			console.log('Direction:', scrollDirection);

			e.preventDefault();

			if (scrollDirection === 'down') {
				scrollToSeaLevel();
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<section id="home-space" class="relative h-screen bg-black">
	<LeftToRightFadeInDown class="mt-24 w-full text-center text-6xl font-bold text-white"
		>Welcome to your abode!
	</LeftToRightFadeInDown>

	<div class="solar-system relative h-[400px] w-full">
		{#each Object.keys(planets) as planet, idx (idx)}
			<Planet randomizePos={false} class={`${getPlanetPosition(planet)}`} {planet} seed={idx} />
		{/each}
	</div>

	{#each Array(generateRandomNumber(300, 500)) as star, idx (idx)}
		<Star seed={idx} />
	{/each}
</section>

<section id="home-space_to_home-earth-clouds" class="h-[1000px] w-full"></section>

<section id="earth-sea-level" class="h-[1000px] w-full bg-black"></section>
