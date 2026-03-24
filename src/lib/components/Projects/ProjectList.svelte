<script>
	import ScaleIn from '$lib/components/Animated/Entity/ScaleIn.svelte';
	import ProjectCard from './ProjectCard.svelte';

	let { projects, onSelect } = $props();
</script>

<div class="flex h-full flex-col gap-4 overflow-hidden">
	<h2 class="px-2 text-xl font-bold text-gray-900 dark:text-white">All Projects</h2>
	<div class="flex flex-col gap-3 overflow-y-auto pr-2">
		{#each projects as project, idx}
			<ScaleIn delayFactor={idx}>
				<ProjectCard {project} {onSelect} />
			</ScaleIn>
		{/each}
	</div>
</div>
