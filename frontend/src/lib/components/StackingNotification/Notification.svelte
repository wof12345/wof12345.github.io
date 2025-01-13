<script>
	let props = $props();
</script>

<button
	style="opacity: 0;"
	class={`active-notification fixed left-0 right-0 mx-auto w-max transition-all duration-200 ease-in-out` +
		props.class}
>
	{@render props.children?.()}
</button>

<style>
	.popInAnimation {
		animation: appear 0.3s ease-in-out;
		z-index: 5;
	}

	@keyframes appear {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
