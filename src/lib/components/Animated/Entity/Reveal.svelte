<script>
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		delay = 0,
		y = 24,
		x = 0,
		once = true,
		threshold = 0.15,
		duration = 700,
		...rest
	} = $props();

	let el = $state();
	let shown = $state(false);

	onMount(() => {
		const reduce =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduce) {
			shown = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						shown = true;
						if (once) observer.unobserve(entry.target);
					} else if (!once) {
						shown = false;
					}
				}
			},
			{ threshold, rootMargin: '0px 0px -8% 0px' }
		);

		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class={twMerge('will-change-transform', rest.class)}
	style="
		transition: opacity {duration}ms cubic-bezier(0.22, 1, 0.36, 1) {delay}ms,
			transform {duration}ms cubic-bezier(0.22, 1, 0.36, 1) {delay}ms;
		opacity: {shown ? 1 : 0};
		transform: {shown ? 'none' : `translate3d(${x}px, ${y}px, 0)`};
	"
>
	{@render children()}
</div>
