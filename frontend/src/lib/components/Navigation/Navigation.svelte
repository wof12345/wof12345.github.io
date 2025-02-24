<script>
	import Logo from '$lib/components/Logo/Logo.svelte';

	let { children } = $props();
</script>

<div class="nav flex h-[100px] w-full items-center justify-between bg-black px-4">
	<Logo />

	<div class="nav-items">
		<ul class="text-md flex gap-5">
			<li>
				<a href="/" class="text-white">Home</a>
			</li>
			<li>
				<a href="/#projects" class="text-white">Projects</a>
			</li>
			<li>
				<a href="/#about" class="text-white">about</a>
			</li>
		</ul>
	</div>
</div>

<div class='nav-sidebar h-screen w-screen fixed left-0 top-0'>
	<div class=bg-gra></div>

	<div class="h-full w-72 bg-black relative z-10"></div>
</div>

{@render children()}
