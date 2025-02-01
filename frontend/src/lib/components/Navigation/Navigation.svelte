<script>
	let { children } = $props();
</script>

<div class="">
	<div class="h-[100px] w-full bg-black"></div>

	{@render children()}
</div>
