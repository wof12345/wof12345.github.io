<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	const {
		children,
		expandDelay = 3000,
		shrinkDelay = 1000,
		onExpand = () => {},
		onShrink = () => {},
		...rest
	} = $props();

	let fillerCircle = $state();
	let fillerCover = $state();
	let animated = $state(false);

	export function expand(delay = expandDelay) {
		setTimeout(() => {
			fillerCircle.style =
				'border-radius: 100%; width: 1500px; height: 1500px; top: 0; left: 0; position: absolute;';
		}, delay);

		setTimeout(() => {
			fillerCircle.style =
				'border-radius: 0; width: 100vw; height: 100vh; top: 0; left: 0; position: absolute; transition: 130ms; z-index: 20;';
		}, delay + 350);

		setTimeout(() => {
			fillerCover.style = 'opacity: 0; transition: 0.5s;';
		}, delay + 1000);

		setTimeout(() => {
			fillerCover.style = 'display: none;';
			animated = true;
			onExpand();
		}, delay + 2000);
	}

	export function shrink(delay = shrinkDelay) {
		setTimeout(() => {
			fillerCover.style = 'transition: 0.5s;';
		}, delay);

		setTimeout(() => {
			fillerCircle.style = 'transition: 0.5s;';
			animated = true;
			onShrink();
		}, delay + 2000);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	style={rest.style}
	bind:this={fillerCircle}
	class={twMerge(
		`bg-primary-950 border-primary-700 absolute bottom-0 left-0 right-0 top-20 z-10 mx-auto h-14 w-14 overflow-hidden rounded-full border-[2px] transition-all duration-700`,
		rest.class
	)}
>
	<!-- <div class={twMerge(`absolute aspect-square w-20 rounded-full bg-white`, rest.class)}></div> -->

	<div
		onclick={rest.onclick}
		bind:this={fillerCover}
		class={twMerge(
			'bg-primary-950 opacity-1 absolute z-50 flex h-full w-full items-center justify-center transition-all',
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
