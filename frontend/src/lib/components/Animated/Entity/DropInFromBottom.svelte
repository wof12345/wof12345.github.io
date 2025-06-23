<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let { children, delayFactor = 1, defaultDelay = 100, ...rest } = $props();

	const initialStyle = 'opacity: 0; transform: translateY(100vw)';

	let animated = $state(false);

	function startSequence() {
		setTimeout(() => {
			requestAnimationFrame(() => {
				if (!animatedContainer) {
					return;
				}

				animatedContainer.style = 'opacity: 1; transform: translateY(0)';
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
	class={twMerge('transition-all duration-[3s]', rest.class)}
	style={initialStyle}
>
	{@render children()}
</div>
