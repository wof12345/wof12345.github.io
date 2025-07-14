<script>
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { onMount } from 'svelte';

	let bubble = $state(undefined);

	const routeIndex = 2;

	let route = $state(routeState.getRoutes()[routeIndex]);

	$effect(() => {
		route = routeState.getRoutes()[routeIndex];
		let active = route.active;

		if (!active) {
			bubble.shrink();
		}
	});

	onMount(() => {
		routeState.setBubble(bubble, routeIndex);
	});
</script>

<Bubble
	bind:this={bubble}
	class="{route.initialClass} bg-{route.primaryColor}-800 m-0"
	coverClass={`hover:cursor-pointer bg-${route.primaryColor}-800`}
	onclick={() => {
		routeState.set(routeIndex);
	}}
	onExpand={() => {}}
	initDelayFactor={(routeState.getRoutes().length - routeIndex) * 0.3}
	initDelay={2500}
	{route}
>
	{#snippet coverChildren()}
		{@const CoverIcon = route.icon}
		<div class="text-lg font-bold text-white">
			<CoverIcon />
		</div>
	{/snippet}

	<div class="flex h-full items-center justify-center text-white">About</div>
</Bubble>
