<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import DropInFromBottom from '$lib/components/Animated/Entity/DropInFromBottom.svelte';
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { onMount } from 'svelte';

	let bubble = $state(undefined);

	let expandDelay = $derived(routeState.getIntro() ? 60 : 3300);

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
	destroyContentOnShrink={false}
	onclick={() => {
		routeState.set(routeIndex);
		bubble.expand();
	}}
	onExpand={() => {
		routeState.setIntro(true);
	}}
	class={`${routeState.getIntro() ? route?.initialClass + ' m-0' : ''} bg-primary-950`}
	coverClass={`hover:cursor-pointer bg-primary-950`}
	{expandDelay}
	{route}
	initDelayFactor={routeIndex}
	initDelay={1000}
	ascend={true}
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

		<div class="flex flex-col gap-1 p-2">
			<LeftToRightFadeInDown
				entryDelay={5300}
				class="w-full text-center text-3xl font-bold text-white"
				>Hello,
			</LeftToRightFadeInDown>

			<LeftToRightFadeInDown class="w-full text-end text-lg font-bold text-white" entryDelay={6000}
				>My name is <span class="text-2xl"> Atif</span>
			</LeftToRightFadeInDown>

			<LeftToRightFadeInDown class="w-full text-2xl font-bold text-white" entryDelay={7400}
				>And
			</LeftToRightFadeInDown>
			<LeftToRightFadeInDown class="ml-10 w-full text-sm font-bold text-white" entryDelay={8000}
				>I am a
			</LeftToRightFadeInDown>
			<LeftToRightFadeInDown class="w-full text-end text-4xl font-bold text-white" entryDelay={8600}
				>Software Developer
			</LeftToRightFadeInDown>
		</div>
	</div>

	{#snippet coverChildren()}
		{@const CoverIcon = route.icon}
		<div class="text-xl font-extrabold text-white">
			<CoverIcon />
		</div>
	{/snippet}
</Bubble>
