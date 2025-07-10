<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	const {
		children,
		expandDelay = 3000,
		shrinkDelay = 400,
		onExpand = () => {},
		onShrink = () => {},
		route,
		...rest
	} = $props();

	let fillerCircle = $state();
	let fillerCover = $state();
	let animated = $state(false);
	let expanded = $state(false);

	export function expand(delay = expandDelay) {
		if (routeState.getAnimationStatus()) {
			return;
		}

		routeState.setAnimationStatus(true);
		setTimeout(() => {
			fillerCircle.style =
				'border-radius: 100%; width: 110vw; height: 110vw; top: 0; left: 0; position: absolute; z-index: 20;';
		}, delay);

		setTimeout(() => {
			fillerCircle.style =
				'border-radius: 0; width: 100vw; height: 100vh; top: 0; left: 0; position: absolute; transition: 130ms; z-index: 20;';
		}, delay + 300);

		setTimeout(() => {
			fillerCover.style = 'opacity: 0; transition: 0.5s;';
			expanded = true;
		}, delay + 1000);

		setTimeout(() => {
			fillerCover.style = 'display: none;';
			animated = true;

			onExpand();
			routeState.setAnimationStatus(false);
		}, delay + 2000);
	}

	export function shrink(delay = shrinkDelay) {
		if (!expanded) return;

		setTimeout(() => {
			fillerCircle.style = 'transition: 0.5s; opacity: 0; z-index: 19;';
			fillerCover.style = 'transition: 0.5s;';
		}, delay);

		setTimeout(() => {
			fillerCircle.style = 'transition: 0.5s;  opacity: 1; ';
			animated = true;
			onShrink();
			expanded = false;
		}, delay + 10);
	}

	$effect(() => {
		console.log(route);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	style={rest.style}
	bind:this={fillerCircle}
	class={twMerge(
		`bg-primary-950 absolute bottom-0 left-0 right-0 top-20 z-10 mx-auto h-14 w-14 overflow-hidden rounded-full border-[3px] border-black transition-all duration-700`,
		rest.class
	)}
>
	{#if route.active}
		<div
			transition:fade
			class={twMerge(
				`absolute flex aspect-square w-14 items-center justify-center rounded-full bg-transparent text-white ${route.initialClass}`,
				rest.class
			)}
		>
			{@render rest.coverChildren()}
		</div>
	{/if}

	<div
		onclick={(e) => {
			if (routeState.getAnimationStatus()) return;
			rest.onclick(e);
		}}
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

	{#if expanded}
		<div class="relative">
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</div>
