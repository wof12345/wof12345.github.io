<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { IconExclamationMark } from '@tabler/icons-svelte';

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
	class="{route.initialClass} m-0 bg-white"
	coverClass={`bg-white hover:cursor-pointer`}
	expandDelay={400}
	onclick={() => {
		bubble.expand();
		routeState.set(routeIndex);
	}}
	onExpand={() => {}}
	{route}
>
	{#snippet coverChildren()}
		{@const CoverIcon = route.icon}
		<div class="text-lg font-bold text-black">
			<CoverIcon />
		</div>
	{/snippet}

	Contact
</Bubble>
