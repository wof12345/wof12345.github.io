<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { twMerge } from 'tailwind-merge';

	let { children, delayFactor = 1, defaultDelay = 100, range = 10, ...rest } = $props();

	let dropRange = {
		1: '1rem',
		2: '',
		3: '',
		4: '',
		5: '',
		6: '',
		7: '',
		8: '',
		9: '',
		10: '100VW'
	};

	const initialStyle = `opacity: 0; transform: translateY(-${dropRange[range]})`;

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

		console.log(tabVisible);

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
