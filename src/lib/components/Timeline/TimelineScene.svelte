<script>
	import ProjectTag from '$lib/components/Projects/ProjectTag.svelte';
	import { IconArrowRight } from '@tabler/icons-svelte';

	let { group, index, total } = $props();
</script>

<article class="relative">
	<div
		class="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-x-12 px-6 md:grid-cols-[1fr_auto] lg:gap-x-20"
	>
		<div class="order-2 flex flex-col md:order-1">
			{#each group.projects as project}
				<div class="flex min-h-screen items-center py-12 first:pt-0 last:pb-0">
					<a
						href="/projects/{project.id}"
						aria-label="View {project.name}"
						class="bg-secondary-700/40 hover:bg-secondary-700/60 ring-secondary-300/10 hover:ring-secondary-300/30 group flex max-h-[82vh] w-full flex-col gap-4 overflow-hidden rounded-2xl p-5 shadow-2xl ring-1 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] md:p-8"
					>
						{#if project.image}
							<div
								class="hidden aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-black/20 sm:block"
							>
								<img
									src={project.image}
									alt={project.name}
									loading="lazy"
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							</div>
						{/if}

						<h3 class="text-2xl leading-tight font-bold md:text-4xl">{project.name}</h3>

						<p class="text-secondary-50/80 line-clamp-3 leading-relaxed md:line-clamp-none">
							{project.description}
						</p>

						{#if project.tags?.length}
							<div class="flex flex-wrap gap-2">
								{#each project.tags as tag}
									<ProjectTag {tag} />
								{/each}
							</div>
						{/if}

						<span
							class="text-secondary-300 group-hover:text-white mt-auto inline-flex items-center gap-2 text-sm font-semibold transition-colors"
						>
							View project
							<IconArrowRight
								size={16}
								class="transition-transform duration-200 group-hover:translate-x-1"
							/>
						</span>
					</a>
				</div>
			{/each}
		</div>

		<div
			class="order-1 flex flex-col gap-3 py-10 md:sticky md:top-0 md:order-2 md:h-screen md:justify-center md:py-0"
		>
			<span class="text-secondary-300 text-xs font-semibold tracking-[0.3em] uppercase">
				{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
			</span>
			<span
				class="text-secondary-50 text-7xl leading-[0.9] font-bold md:text-8xl xl:text-9xl"
			>
				{group.period}
			</span>
			<div class="bg-secondary-300 h-1 w-20 rounded-full"></div>
			{#if group.context}
				<span
					class="text-secondary-200 mt-1 text-xs font-semibold tracking-widest uppercase md:text-sm"
				>
					{group.context}
				</span>
			{/if}
			<p class="text-secondary-100/60 mt-1 hidden text-sm md:block">
				{group.projects.length}
				{group.projects.length === 1 ? 'project' : 'projects'}
			</p>
		</div>
	</div>
</article>
