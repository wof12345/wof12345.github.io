<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	const { children, expandDelay = 3000, expand = false, ...rest } = $props();

	let fillerCircle = $state();
	let fillerCover = $state();
	let animated = $state(false);

	function expandBubble(delay) {
		setTimeout(() => {
			fillerCircle.style =
				'border-radius: 0; width: 100vw; height: 100vh; top: 0; position: absolute;';
		}, delay);

		setTimeout(() => {
			fillerCover.style = 'opacity: 0; transition: 0.5s;';
		}, delay + 1000);

		setTimeout(() => {
			fillerCover.style = 'display: none;';
		}, delay + 2000);

		animated = true;
	}

	$effect(() => {
		const tabVisible = tabVisibleState.get();
		console.log(expand);

		if (!animated && tabVisible && expand) {
			expandBubble(expandDelay);
		}
	});
</script>

<div
	bind:this={fillerCircle}
	class={twMerge(
		`bg-primary-950 border-primary-700 absolute bottom-0 left-0 right-0 top-20 mx-auto aspect-square h-10 w-10 overflow-hidden rounded-full border-[2px] transition-all`,
		rest.class
	)}
>
	<div
		bind:this={fillerCover}
		class={twMerge(
			'bg-primary-950 opacity-1 absolute z-20 flex h-full w-full items-center justify-center transition-all',
			rest.coverClass
		)}
	>
		{#if rest.coverChildren}
			{@render rest.coverChildren()}
		{/if}
	</div>

	<div class="relative z-10">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
