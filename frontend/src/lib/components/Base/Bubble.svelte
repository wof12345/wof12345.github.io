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
				'border-radius: 100%; width: 1500px; height: 1500px; top: 0; left: 0; position: absolute;';
		}, delay);

		setTimeout(() => {
			fillerCircle.style =
				'border-radius: 0; width: 100vw; height: 100vh; top: 0; left: 0; position: absolute; transition: 130ms';
		}, delay + 350);

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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={rest.onclick}
	style={rest.style}
	bind:this={fillerCircle}
	class={twMerge(
		`bg-primary-950 border-primary-700 absolute bottom-0 left-0 right-0 top-20 z-10 mx-auto h-14 w-14 overflow-hidden rounded-full border-[2px] transition-all duration-700`,
		rest.class
	)}
>
	<div class={twMerge(`absolute aspect-square w-20 rounded-full bg-white`, rest.class)}></div>

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

	<div class="relative">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
