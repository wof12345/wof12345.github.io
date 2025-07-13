<script>
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';

	let bubble = $state(undefined);

	const routeIndex = 3;

	let route = $state(routeState.getRoutes()[routeIndex]);

	$effect(() => {
		route = routeState.getRoutes()[routeIndex];
		let active = route.active;

		if (!active) {
			bubble.shrink();
		}
	});
</script>

<Bubble
	bind:this={bubble}
	class="{route.initialClass} bg-fourth-600 m-0"
	coverClass={`hover:cursor-pointer  bg-fourth-600`}
	onclick={() => {
		bubble.expand();
		routeState.set(routeIndex);
	}}
	onExpand={() => {}}
	initDelayFactor={(routeState.getRoutes().length - routeIndex) * 0.5}
	initDelay={3300}
	{route}
>
	{#snippet coverChildren()}
		{@const CoverIcon = route.icon}
		<div class="text-lg font-bold text-white">
			<CoverIcon />
		</div>
	{/snippet}

	<div class="flex h-full items-center justify-center text-white">Contact</div>
</Bubble>
