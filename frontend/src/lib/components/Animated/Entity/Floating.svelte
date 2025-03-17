<script>
	import { twMerge } from 'tailwind-merge';

	let { children, ...rest } = $props();
</script>

<div class={twMerge('float', rest.class)}>
	{@render children()}
</div>

<style>
	:root {
		--float-distance: 5px;
	}

	.float {
		transition: all 0.5s;
		animation: float 5s infinite both;
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
