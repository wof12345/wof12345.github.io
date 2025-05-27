<script>
	import { generateRandomNumber } from '$lib/utils/number';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let { seed, top, left, ...rest } = $props();

	let windowWidth = $state(0);
	let windowHeight = $state(0);

	let planet = $state();

	function determinePlanetPosition(seed) {
		let left = generateRandomNumber(40, windowWidth - 50);
		let top = seed * 70;

		return `top:${top}px; left:${left}px;`;
	}

	onMount(() => {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;

		const placementStyle = determinePlanetPosition(seed);

		setTimeout(() => {
			if (!planet) return;
			1;
			requestAnimationFrame(() => {
				planet.style = placementStyle;
			});
		}, 30 * seed);
	});
</script>

<div bind:this={planet} class={twMerge('absolute z-20 aspect-square w-10', rest.class)}>
	<img src={`/planets/planet-${seed + 1}.png`} alt="" />
</div>
