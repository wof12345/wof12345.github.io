<script>
	import { generateRandomNumber } from '$lib/utils/number';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Floating from '$lib/components/Animated/Entity/Floating.svelte';

	let { seed, planet, randomizePos = true, ...rest } = $props();

	let windowWidth = $state(0);
	let windowHeight = $state(0);

	let planetElement = $state();

	function determinePlanetPosition(seed) {
		let left = generateRandomNumber(40, windowWidth - 50);
		let top = seed * 70;

		return `top:${top}px; left:${left}px;`;
	}

	onMount(() => {
		if (!randomizePos) return;

		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;

		const placementStyle = determinePlanetPosition(seed);

		setTimeout(() => {
			if (!planet) return;

			requestAnimationFrame(() => {
				planet.style = placementStyle;
			});
		}, 30 * seed);
	});
</script>

<div
	bind:this={planetElement}
	class={twMerge('absolute z-20 aspect-square w-10 hover:cursor-pointer', rest.class)}
>
	<DropInFromAbove delayFactor={seed * 4}>
		<Floating delayFactor={seed * 3} animationDurationFactor={seed + 2}>
			<img src={`/planets/${planet}.png`} alt="" />
		</Floating>
	</DropInFromAbove>
</div>
