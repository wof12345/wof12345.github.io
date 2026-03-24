<script>
	import ProjectTag from './ProjectTag.svelte';

	let { project } = $props();
</script>

{#if project}
	<div class="flex h-full flex-col gap-6 overflow-y-auto pr-4">
		<img
			src={project.image}
			alt={project.name}
			class="h-64 w-full rounded-xl object-cover shadow-lg"
		/>

		<div class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
				<div class="flex flex-wrap gap-2">
					{#each project.tags as tag}
						<ProjectTag {tag} />
					{/each}
				</div>
			</div>

			<p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
				{project.longDescription || project.description}
			</p>

			<div class="mt-4 flex gap-4">
				<button
					class="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
				>
					View Live
				</button>
				<button
					class="rounded-full border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					GitHub
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full items-center justify-center text-gray-400">
		<p class="text-xl">Select a project to view details</p>
	</div>
{/if}
