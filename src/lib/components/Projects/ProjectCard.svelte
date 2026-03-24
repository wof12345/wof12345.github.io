<script>
	import ProjectTag from './ProjectTag.svelte';

	let { project, onSelect } = $props();

	let showFullDescription = $state(false);

	const truncatedDescription = $derived(
		project.description.length > 80 ? project.description.slice(0, 80) + '...' : project.description
	);
</script>

<div
	class="group flex w-full gap-3 overflow-hidden rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
>
	<img
		src={project.image}
		alt={project.name}
		class="h-20 w-20 flex-shrink-0 cursor-pointer rounded-md object-cover"
		onclick={() => onSelect(project)}
	/>

	<div class="flex min-w-0 flex-col gap-1">
		<h3
			class="cursor-pointer truncate text-sm font-bold text-gray-900 dark:text-white"
			onclick={() => onSelect(project)}
		>
			{project.name}
		</h3>

		<div class="flex flex-wrap gap-1">
			{#each project.tags as tag}
				<ProjectTag {tag} />
			{/each}
		</div>

		<p class="text-xs text-gray-600 dark:text-gray-400">
			{showFullDescription ? project.description : truncatedDescription}
			{#if project.description.length > 80}
				<button
					class="ml-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
					onclick={(e) => {
						e.stopPropagation();
						showFullDescription = !showFullDescription;
					}}
				>
					{showFullDescription ? 'Show less' : 'See more'}
				</button>
			{/if}
		</p>
	</div>
</div>
