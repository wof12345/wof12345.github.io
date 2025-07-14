<script>
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		delayFactor = 1,
		defaultDelay = 100,
		defaultAnimationDuration = 5,
		animationDurationFactor = 1,
		...rest
	} = $props();

	let animationDelay = $derived(`${defaultDelay * delayFactor}ms`);
	let animationDuration = $derived(`${defaultAnimationDuration * animationDurationFactor}s`);
</script>

<div
	class={twMerge('float', rest.class)}
	style={`animation-delay: ${animationDelay}; animation-duration: ${animationDuration};`}
>
	{@render children()}
</div>

<style>
	:root {
		--float-distance: 5px;
	}

	.float {
		transition: all 0.5s;
		animation: float infinite both;
	}

	@keyframes float {
		0% {
			transform: translateY(calc(-1 * var(--float-distance)));
		}

		50% {
			transform: translateY(var(--float-distance));
		}

		100% {
			transform: translateY(calc(-1 * var(--float-distance)));
		}
	}
</style>
