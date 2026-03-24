<script>
	import Tooltip from '$lib/components/Base/Tooltip.svelte';
	let { tag } = $props();
</script>

<Tooltip>
	<span
		class="inline-block cursor-default rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300"
	>
		{tag}
	</span>

	{#snippet tooltipSnippet()}
		<div class="max-w-[200px] text-center">
			More information about the <span class="font-bold text-blue-400">{tag}</span> technology used in this project.
		</div>
	{/snippet}
</Tooltip>
