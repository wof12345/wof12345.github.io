<script>
	import { IconExternalLink } from '@tabler/icons-svelte';

	/** @type {{ href?: string | null; label?: string }} */
	let { href, label = 'Live' } = $props();

	const baseClass =
		'inline-flex w-fit items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-emerald-200 uppercase ring-1 ring-emerald-400/30 transition hover:brightness-110 md:text-xs';
</script>

{#if href}
	<a
		{href}
		target="_blank"
		rel="noopener noreferrer"
		onclick={(e) => e.stopPropagation()}
		class={baseClass}
		title="Open the live site in a new tab"
	>
		<span class="relative flex h-1.5 w-1.5">
			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
			></span>
			<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
		</span>
		{label}
		<IconExternalLink size={12} />
	</a>
{/if}
