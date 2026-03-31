<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { twMerge } from 'tailwind-merge';

	let { children, delayFactor = 1, defaultDelay = 100, duration=3, ...rest } = $props();

	const initialStyle = 'opacity: 0; transform: scale(0)';

	let animated = $state(false);

	function startSequence() {
		setTimeout(() => {
			requestAnimationFrame(() => {
				if (!animatedContainer) {
					return;
				}

				animatedContainer.style = 'opacity: 1; transform: scale(1)';
				animated = true;
			});
		}, delayFactor * defaultDelay);
	}

	let animatedContainer;

	$effect(() => {
		const tabVisible = tabVisibleState.get();

		if (!animated && tabVisible) {
			startSequence();
		}
	});
</script>

<div
	bind:this={animatedContainer}
	class={twMerge(`transition-all duration-[${duration}s]`, rest.class)}
	style={initialStyle}
>
	{@render children()}
</div>
