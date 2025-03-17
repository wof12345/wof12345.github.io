<script>
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let { children, ...rest } = $props();

	const initialStyle = 'opacity: 0; transform: translateY(-100vw)';

	function startSequence() {
		setTimeout(() => {
			requestAnimationFrame(() => {
				animatedContainer.style = 'opacity: 1; transform: translateY(0)';
			});
		}, 100);
	}

	let animatedContainer;

	onMount(() => {
		startSequence();
	});
</script>

<div
	bind:this={animatedContainer}
	class={twMerge('transition-all duration-[3s]', rest.class)}
	style={initialStyle}
>
	{@render children()}
</div>
