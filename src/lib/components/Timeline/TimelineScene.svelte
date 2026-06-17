<script>
	import ProjectCard from '$lib/components/Projects/ProjectCard.svelte';
	import Reveal from '$lib/components/Animated/Entity/Reveal.svelte';

	let { group, index, total } = $props();
</script>

<article class="relative">
	<div
		class="mx-auto flex w-full max-w-6xl flex-col gap-x-12 px-6 md:grid md:grid-cols-[1fr_auto] md:items-start lg:gap-x-20"
	>
		<div
			class="bg-secondary-800/90 sticky top-0 z-20 -mx-6 flex flex-row items-baseline gap-3 border-b border-white/5 px-6 py-3 backdrop-blur-sm md:order-2 md:mx-0 md:flex md:h-screen md:flex-col md:items-start md:justify-center md:gap-3 md:border-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none"
		>
			<span
				class="text-secondary-300 text-[10px] font-semibold tracking-[0.25em] uppercase md:text-xs md:tracking-[0.3em]"
			>
				{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
			</span>
			<span
				class="text-secondary-50 text-3xl leading-none font-bold md:text-7xl md:leading-[0.9] xl:text-9xl"
			>
				{group.period}
			</span>
			<div class="bg-secondary-300 hidden h-1 w-20 rounded-full md:block"></div>
			{#if group.context}
				<span
					class="text-secondary-200 text-[10px] font-semibold tracking-widest uppercase md:mt-1 md:text-sm"
				>
					<span class="md:hidden">·</span>
					{group.context}
				</span>
			{/if}
			<p class="text-secondary-100/60 mt-1 hidden text-sm md:block">
				{group.projects.length}
				{group.projects.length === 1 ? 'project' : 'projects'}
			</p>
		</div>

		<div class="flex flex-col md:order-1">
			{#each group.projects as project}
				<div
					class="flex min-h-max items-center py-6 first:pt-4 last:pb-12 md:min-h-screen md:py-12 md:first:pt-0 md:last:pb-0"
				>
					<Reveal class="w-full" y={40} threshold={0.2}>
						<ProjectCard {project} />
					</Reveal>
				</div>
			{/each}
		</div>
	</div>
</article>
