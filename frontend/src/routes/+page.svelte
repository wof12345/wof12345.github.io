<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Floating from '$lib/components/Animated/Entity/Floating.svelte';
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Star from '$lib/components/Base/Star.svelte';
	import { generateRandomNumber } from '$lib/utils/number.js';
	import Planet from '$lib/components/Base/Planet.svelte';

	function getPlanetPosition(idx) {
		let posClass = `top-[${10 * idx}px] left-[${10 * idx}px]`;

		if (idx === 8) {
			posClass = `top-0 right-0 bottom-0 left-0 m-auto`;
		}

		return posClass;
	}
</script>

<div class="relative h-screen bg-black">
	<LeftToRightFadeInDown class="mt-24 w-full text-center text-6xl font-bold text-white"
		>Welcome to your abode!
	</LeftToRightFadeInDown>

	{#each Array(9) as planet, idx (idx)}
		<DropInFromAbove delayFactor={idx * 4} class="absolute">
			<Floating delayFactor={idx * 3} animationDurationFactor={idx + 2}>
				<Planet class={getPlanetPosition(idx)} seed={idx} />
			</Floating>
		</DropInFromAbove>
	{/each}

	{#each Array(generateRandomNumber(100, 500)) as star, idx (idx)}
		<Star seed={idx} />
	{/each}
</div>
