<script>
	import Floating from '$lib/components/Animated/Entity/Floating.svelte';
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Star from '$lib/components/Base/Star.svelte';
</script>

<div class="relative h-screen bg-black">
	<LeftToRightFadeInDown class="mt-24 w-full text-center text-6xl font-bold text-white"
		>Welcome to your abode!
	</LeftToRightFadeInDown>

	<Floating class="left-10 top-52 z-10">
		<img src="/planet-1.png" alt="" />
	</Floating>

	{#each Array(300) as star, idx (idx)}
		<Star seed={idx} />
	{/each}
</div>
