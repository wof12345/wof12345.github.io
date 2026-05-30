<script>
	import CompanyTag from './CompanyTag.svelte';
	import ProjectTag from './ProjectTag.svelte';
	import { IconArrowRight } from '@tabler/icons-svelte';

	let { project } = $props();
</script>

<div
	class="bg-secondary-700/40 hover:bg-secondary-700/60 ring-secondary-300/10 hover:ring-secondary-300/30 group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl p-5 shadow-2xl ring-1 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] md:gap-4 md:p-8"
>
	<a
		href="/projects/{project.id}"
		aria-label="View {project.name}"
		class="absolute inset-0 z-10 rounded-2xl"
	></a>

	<div class="pointer-events-none relative z-20 flex flex-col gap-3 md:gap-4 h-max">
		{#if project.image}
			<div class="aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-black/20">
				<img
					src={project.image}
					alt={project.name}
					loading="lazy"
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>
			</div>
		{/if}

		<div class="flex items-start justify-between gap-3">
			<h3 class="text-xl leading-tight font-bold sm:text-2xl md:text-4xl">
				{project.name}
			</h3>

			{#if project.company}
				<div class="pointer-events-auto">
					<CompanyTag company={project.company} />
				</div>
			{/if}
		</div>

		<p
			class="text-secondary-50/80 line-clamp-3 text-sm leading-relaxed md:line-clamp-none md:text-base"
		>
			{project.description}
		</p>

		{#if project.tags?.length}
			<div class="flex flex-wrap gap-1.5 md:gap-2">
				{#each project.tags as tag}
					<ProjectTag {tag} />
				{/each}
			</div>
		{/if}

		<span
			class="text-secondary-300 group-hover:text-white mt-auto inline-flex items-center gap-2 text-xs font-semibold transition-colors md:text-sm"
		>
			View project
			<IconArrowRight
				size={16}
				class="transition-transform duration-200 group-hover:translate-x-1"
			/>
		</span>
	</div>
</div>
