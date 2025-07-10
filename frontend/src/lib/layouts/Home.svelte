<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import DropInFromBottom from '$lib/components/Animated/Entity/DropInFromBottom.svelte';
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { onMount } from 'svelte';

	let bubble = $state(undefined);

	let reset = $state(false);
	let expandDelay = $state(3300);

	const routeIndex = 0;

	let route = $state(routeState.getRoutes()[routeIndex]);

	$effect(() => {
		route = routeState.getRoutes()[routeIndex];
		let active = route.active;

		if (!active) {
			bubble.shrink();
		}
	});

	onMount(() => {
		bubble.expand();
	});
</script>

<Bubble
	bind:this={bubble}
	onclick={() => {
		routeState.set(routeIndex);
		bubble.expand();
	}}
	onExpand={() => {
		routeState.setIntro(true);
	}}
	class={routeState.getIntro() ? route?.initialClass + ' m-0' : ''}
	coverClass={`hover:cursor-pointer`}
	{expandDelay}
	shrinkDelay={400}
>
	<div class="relative z-30 flex flex-col items-center justify-center pt-24">
		<DropInFromAbove defaultDelay={2500}>
			<div
				class="flex aspect-square w-52 items-center justify-center rounded-full bg-gray-50 bg-opacity-5"
			>
				<div class="h-full w-full overflow-hidden rounded-full">
					<img src="/dev/dev.jpg" alt="" class="object-cover object-center" />
				</div>
			</div>
		</DropInFromAbove>

		<button
			class="text-white"
			onclick={(e) => {
				reset = true;
				expandDelay = 400;
			}}>Close</button
		>

		<div class="flex flex-col p-2">
			<LeftToRightFadeInDown
				entryDelay={5200}
				class="w-full text-center text-4xl font-bold text-white"
				>Hello,
			</LeftToRightFadeInDown>

			<LeftToRightFadeInDown
				class="text-md ml-20 w-full text-end font-bold text-white"
				entryDelay={6000}
				>My name is Atif
			</LeftToRightFadeInDown>
		</div>
	</div>

	{#snippet coverChildren()}
		{@const CoverIcon = route.icon}
		<div class="text-lg font-bold text-black">
			<CoverIcon />
		</div>
	{/snippet}
</Bubble>
