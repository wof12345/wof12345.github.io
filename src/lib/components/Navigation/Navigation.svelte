<script>
	import Logo from '$lib/components/Logo/Logo.svelte';
	import { fly } from 'svelte/transition';
	import NavigationItems from './NavigationItems.svelte';

	let { children } = $props();
</script>

<!-- TODO: improve -->
<div class="nav flex h-[100px] w-full items-center justify-between bg-black px-4">
	<Logo />

	<div class="hidden md:block">
		<NavigationItems />
	</div>
</div>

{#if true}
	<div
		transition:fly={{ x: -100 }}
		class="nav-sidebar fixed left-0 top-0 flex h-screen w-screen md:hidden"
	>
		<div class="bg-gray-100"></div>

		<div class="relative z-10 h-full w-72 bg-black">
			<NavigationItems />
		</div>
	</div>
{/if}

{@render children()}
