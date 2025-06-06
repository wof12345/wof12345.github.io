<script>
	import { twMerge } from 'tailwind-merge';
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Floating from '$lib/components/Animated/Entity/Floating.svelte';

	let { seed, planet, name, randomizePos = true, ...rest } = $props();

	let planetElement = $state();
</script>

<div
	bind:this={planetElement}
	class={twMerge('absolute z-20 aspect-square w-10 hover:cursor-pointer', rest.class)}
>
	<DropInFromAbove delayFactor={seed * 4}>
		<Floating delayFactor={seed * 3} animationDurationFactor={seed + 2}>
			<img src={`/planets/${name}.png`} alt="" />
		</Floating>
	</DropInFromAbove>
</div>
