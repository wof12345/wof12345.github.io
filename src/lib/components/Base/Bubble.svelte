<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	const {
		children,
		expandDelay = 60,
		shrinkDelay = 10,
		onExpand = () => {},
		onShrink = () => {},
		destroyContentOnShrink = true,
		route,
		initDelay = 300,
		initDelayFactor = 1,
		ascend = false,
		...rest
	} = $props();

	let bubble = $state();
	let fillerCover = $state();
	let animated = $state(false);
	let expanded = $state(false);

	let hover = $state(false);

	let infoBox = $state(undefined);

	let styleMemory = $state('');

	let animationQueue = $state(undefined);

	export function expand(delay = expandDelay) {
		if (routeState.getAnimationStatus()) {
			return;
		}

		if (!tabVisibleState.get()) {
			animationQueue = 'expand';
			return;
		}

		const delayFactor = !routeState.getIntro() ? 50 : 0;

		routeState.setAnimationStatus(true);
		setTimeout(() => {
			bubble.style = `border-radius: 0.375rem; transition: 2s;`;
		}, delayFactor);

		setTimeout(() => {
			bubble.style = `border: 2px; border-radius: 0; width: 100vw; height: 100vh; top: 0; left: 0; position: absolute; z-index: 20; ${styleMemory} transition: 0.4s; transition-duration: 500ms;`;
		}, delay + delayFactor);

		setTimeout(
			() => {
				fillerCover.style = 'opacity: 0; transition: 0.3s;';
				expanded = true;
			},
			delay + 650 + delayFactor
		);

		setTimeout(
			() => {
				fillerCover.style = 'display: none;';
				animated = true;

				onExpand();
				routeState.setAnimationStatus(false);
			},
			delay + 900 + delayFactor
		);
	}

	export function shrink(delay = shrinkDelay) {
		if (!expanded) return;

		if (!tabVisibleState.get()) {
			animationQueue = 'shrink';
			return;
		}

		setTimeout(() => {
			bubble.style = `opacity: 0; z-index: 19; ${styleMemory} transition: 0.6;`;
			fillerCover.style = 'transition: 0.5s;';
		}, delay);

		setTimeout(() => {
			bubble.style = `transition: 0.5s;  opacity: 1; ${styleMemory} transition: 0.3s;`;
			animated = true;
			onShrink();
			expanded = false;
		}, delay + 1000);
	}

	$effect(() => {
		if (tabVisibleState.get() && !routeState.getAnimationStatus() && animationQueue) {
			if (animationQueue === 'expand') {
				expand();
			} else if (animationQueue === 'shrink') {
				shrink();
			}

			animationQueue = undefined;
		}
	});

	const initialDescendingStyle = 'opacity: 0; transform: translateY(-100vw); transition: 2s;';
	const initialAscendingStyle = 'opacity: 0; transform: translateY(100vw); transition: 2s;';

	function startSequence() {
		setTimeout(() => {
			requestAnimationFrame(() => {
				if (!bubble) {
					return;
				}

				bubble.style = 'opacity: 1; transform: translateY(0); transition: 2s;';
				styleMemory = bubble.style;

				animated = true;
			});
		}, initDelay * initDelayFactor);
	}

	$effect(() => {
		const tabVisible = tabVisibleState.get();

		if (!animated && tabVisible) {
			startSequence();
		}
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->

<div
	style={'transition: 1.5s;' +
		rest.style +
		(ascend ? initialAscendingStyle : initialDescendingStyle)}
	bind:this={bubble}
	class={twMerge(
		`bg-primary-950 absolute bottom-0 left-0 right-0 top-20 z-10 mx-auto h-12 w-12 overflow-hidden rounded-md border-black shadow-lg transition-all ${!routeState.getIntro() ? `rounded-full border-${route.primaryColor}-200` : ''}`,
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
		onmouseenter={(e) => {
			hover = true;
			const { clientX, clientY } = e;

			// Adjust to prevent the box going off-screen if needed

			if (!infoBox) return;

			infoBox.style.top = `${clientY + 5}px`;
			infoBox.style.left = `${clientX + 5}px`;
		}}
		onmouseleave={() => {
			hover = false;
		}}
		onclick={(e) => {
			if (routeState.getAnimationStatus()) return;
			rest.onclick(e);
		}}
		bind:this={fillerCover}
		class={twMerge(
			'opacity-1 bg-primary-950 absolute z-50 flex h-full w-full items-center justify-center transition-all',
			rest.coverClass
		)}
	>
		{#if rest.coverChildren}
			{@render rest.coverChildren()}
		{/if}
	</div>

	{#if (expanded && destroyContentOnShrink) || !destroyContentOnShrink}
		{#if children}
			{@render children()}
		{/if}
	{/if}
</div>

<div bind:this={infoBox} class="absolute left-2 top-5 z-40 w-max">
	{#if hover}
		<div
			transition:fade
			onmouseenter={() => {
				hover = true;
			}}
			onmouseleave={() => {
				hover = false;
			}}
			class="w-max rounded-sm p-1 text-sm text-white bg-{route.primaryColor}-800"
			style={route.initialStyle}
		>
			{route.name}
		</div>
	{/if}
</div>
