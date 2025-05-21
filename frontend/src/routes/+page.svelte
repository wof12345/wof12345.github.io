<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Floating from '$lib/components/Animated/Entity/Floating.svelte';
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Star from '$lib/components/Base/Star.svelte';
	import { generateRandomNumber } from '$lib/utils/number.js';
</script>

<div class="relative h-screen bg-black">
	<LeftToRightFadeInDown class="mt-24 w-full text-center text-6xl font-bold text-white"
		>Welcome to your abode!
	</LeftToRightFadeInDown>

	<DropInFromAbove class="absolute left-10 top-52 z-10">
		<Floating>
			<img src="/planet-1.png" alt="" />
		</Floating>
	</DropInFromAbove>

	{#each Array(generateRandomNumber(100, 500)) as star, idx (idx)}
		<Star seed={idx} />
	{/each}
</div>
