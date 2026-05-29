<script>
	import ProjectTag from '$lib/components/Projects/ProjectTag.svelte';
	import { onMount } from 'svelte';

	let { project, index = 0, side = 'left' } = $props();

	let entry = $state();
	let visible = $state(false);

	onMount(() => {
		if (!entry) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						visible = true;
						observer.disconnect();
						break;
					}
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
		);

		observer.observe(entry);
		return () => observer.disconnect();
	});

	const offsetSign = side === 'left' ? '-' : '';
</script>

<div
	bind:this={entry}
	class="relative grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12"
>
	<div
		class="bg-secondary-300 ring-secondary-800 absolute top-8 left-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full ring-4 md:top-1/2 md:left-1/2 md:-translate-y-1/2"
	></div>

	<div
		class="pl-12 transition-all duration-700 ease-out md:pl-0 {side === 'left'
			? 'md:order-1 md:pr-12 md:text-end'
			: 'md:order-2 md:pl-12'}"
		style:opacity={visible ? 1 : 0}
		style:transform={visible ? 'translateX(0)' : `translateX(${offsetSign}40px)`}
		style:transition-delay="{Math.min(index, 3) * 80}ms"
	>
		<a
			href="/projects/{project.id}"
			aria-label="View {project.name}"
			class="bg-secondary-700/40 hover:bg-secondary-700/60 ring-secondary-300/10 hover:ring-secondary-300/30 group flex flex-col gap-4 rounded-2xl p-5 shadow-xl ring-1 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-6"
		>
			{#if project.image}
				<div class="aspect-video w-full overflow-hidden rounded-xl bg-black/20">
					<img
						src={project.image}
						alt={project.name}
						loading="lazy"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				</div>
			{/if}

			{#if project.period}
				<span class="text-secondary-300 text-xs font-semibold tracking-widest uppercase">
					{project.period}
				</span>
			{/if}

			<h3 class="text-2xl font-bold text-white md:text-3xl">{project.name}</h3>

			<p class="text-secondary-50/80 leading-relaxed">
				{project.description}
			</p>

			{#if project.tags?.length}
				<div
					class="flex flex-wrap gap-2 {side === 'left' ? 'md:justify-end' : 'md:justify-start'}"
				>
					{#each project.tags as tag}
						<ProjectTag {tag} />
					{/each}
				</div>
			{/if}

			<span
				class="text-secondary-300 group-hover:text-white mt-1 inline-flex items-center gap-1 text-sm font-semibold transition-colors {side ===
				'left'
					? 'md:justify-end'
					: 'md:justify-start'}"
			>
				View project
				<span
					class="inline-block transition-transform duration-200 group-hover:translate-x-1"
					aria-hidden="true">→</span
				>
			</span>
		</a>
	</div>

	<div class="hidden md:block {side === 'left' ? 'md:order-2' : 'md:order-1'}"></div>
</div>
