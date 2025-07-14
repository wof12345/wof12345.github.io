<script>
	import { IconExclamationCircle, IconHome } from '@tabler/icons-svelte';

	let defaultNavItems = [
		{
			name: 'Home',
			href: '',
			icon: IconHome
		},
		{
			name: 'About',
			href: '',
			icon: IconExclamationCircle
		}
	];

	let { items = defaultNavItems } = $props();
</script>

<ul class="nav-items text-md flex flex-col gap-5 md:flex-row">
	{#each items as { name, href, icon: Icon }}
		<li>
			<a class="flex items-center justify-center gap-1 text-white" {href}>
				<Icon size={25} />
				<p>{name}</p>
			</a>
		</li>
	{/each}
</ul>
