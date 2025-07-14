<script>
	import { scrollState } from '$lib/stores/dom.svelte';

	import { twMerge } from 'tailwind-merge';

	let { children, delayFactor = 1, defaultDelay = 50, ...rest } = $props();

	function handleScroll(scroll) {
		requestAnimationFrame(() => {
			if (!animatedContainer) {
				return;
			}

			const scaleValue = 1 - scroll / 100;
			const allowedScale = scaleValue > 0 ? scaleValue : 0.3;

			animatedContainer.style = `opacity: 1; transform: translateY(-${scroll * delayFactor}px) scale(${allowedScale}); ${rest.style}`;
		});
	}

	let animatedContainer;

	$effect(() => {
		const scroll = scrollState.get();
		handleScroll(Math.round(scroll));
	});
</script>

<div bind:this={animatedContainer} class={twMerge('transition-all duration-[1.5s]', rest.class)}>
	{@render children()}
</div>
