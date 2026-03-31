<script>
	import ScaleIn from '$lib/components/Animated/Entity/ScaleIn.svelte';
	import FadeIn from '../Animated/Entity/FadeIn.svelte';
	import ProjectCard from './ProjectCard.svelte';

	let { projects, onSelect } = $props();
</script>

<div class="flex h-full flex-col gap-4 overflow-hidden">
	<div class="flex flex-col gap-3 overflow-y-auto pr-2">
		{#each projects as project, idx}
			<FadeIn defaultDelay={50} duration={1.5} delayFactor={idx*8}>
				<ProjectCard {project} {onSelect} />
			</FadeIn>
		{/each}
	</div>
</div>
