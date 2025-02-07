<script>
	import Logo from '$lib/components/Logo/Logo.svelte';

	let { children } = $props();
</script>

<div class="">
	<div class="h-[100px] w-full bg-black">
		<Logo />
	</div>

	{@render children()}
</div>
