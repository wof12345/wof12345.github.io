<script>
	import ProjectTag from '$lib/components/Projects/ProjectTag.svelte';
	import {
		IconArrowLeft,
		IconBrandGithub,
		IconExternalLink
	} from '@tabler/icons-svelte';

	let { data } = $props();

	let project = $derived(data.project);
	let selectedImage = $state(data.project.image);
	let images = $state([data.project.image].filter(Boolean));
	let isLoading = $state(false);

	$effect(() => {
		const current = project;
		selectedImage = current.image;
		images = current.image ? [current.image] : [];
		loadProjectImages(current);
	});

	async function loadProjectImages(p) {
		if (!p?.id) return;
		isLoading = true;

		const found = p.image ? [p.image] : [];
		const exts = ['png', 'webp', 'jpg', 'jpeg'];

		for (let i = 1; i <= 5; i++) {
			let hit = false;
			for (const ext of exts) {
				const path = `/${p.id}/p_${i}.${ext}`;
				try {
					const res = await fetch(path, { method: 'HEAD' });
					if (res.ok) {
						if (!found.includes(path)) found.push(path);
						hit = true;
						break;
					}
				} catch {
					// ignore
				}
			}
			if (!hit && i > 1) break;
		}

		if (project?.id === p.id) {
			images = found;
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{project.name} · Atif</title>
	<meta name="description" content={project.description} />
</svelte:head>

<main class="bg-secondary-950 min-h-screen w-full text-white">
	<header class="bg-secondary-800 w-full px-6 py-12 md:py-16">
		<div class="mx-auto flex max-w-5xl flex-col gap-4">
			<a
				href="/#projects"
				class="text-secondary-200 hover:text-white inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors"
			>
				<IconArrowLeft size={18} />
				<span>Back to projects</span>
			</a>

			<div class="flex flex-wrap items-center gap-3 text-sm">
				{#if project.period}
					<span class="text-secondary-300 font-semibold tracking-widest uppercase">
						{project.period}
					</span>
				{/if}
				{#if project.tags?.length}
					<span class="text-secondary-400">·</span>
					<div class="flex flex-wrap gap-2">
						{#each project.tags as tag}
							<ProjectTag {tag} />
						{/each}
					</div>
				{/if}
			</div>

			<h1 class="text-4xl font-bold md:text-6xl">{project.name}</h1>

			<p class="text-secondary-100/80 max-w-3xl text-lg leading-relaxed">
				{project.description}
			</p>

			{#if project.links?.live || project.links?.github}
				<div class="mt-2 flex flex-wrap gap-3">
					{#if project.links?.live}
						<a
							href={project.links.live}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-secondary-300 text-secondary-950 hover:bg-white inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-colors"
						>
							<IconExternalLink size={18} />
							View live
						</a>
					{/if}
					{#if project.links?.github}
						<a
							href={project.links.github}
							target="_blank"
							rel="noopener noreferrer"
							class="ring-secondary-300/40 hover:bg-secondary-700 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold ring-1 transition-colors"
						>
							<IconBrandGithub size={18} />
							GitHub
						</a>
					{/if}
				</div>
			{/if}
		</div>
	</header>

	<section class="mx-auto max-w-5xl px-6 py-12 md:py-16">
		{#if selectedImage}
			<div
				class="ring-secondary-300/10 relative aspect-video w-full overflow-hidden rounded-2xl bg-black/30 shadow-2xl ring-1"
			>
				<img
					src={selectedImage}
					alt={project.name}
					class="h-full w-full object-cover transition-opacity duration-300"
				/>
				{#if isLoading && images.length <= 1}
					<div class="absolute inset-0 flex items-center justify-center bg-black/20">
						<div
							class="border-secondary-300 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
						></div>
					</div>
				{/if}
			</div>

			{#if images.length > 1}
				<div class="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
					{#each images as img}
						<button
							type="button"
							class="group relative aspect-square overflow-hidden rounded-xl ring-2 transition-all hover:scale-[1.03] {selectedImage ===
							img
								? 'ring-secondary-300'
								: 'ring-transparent opacity-70 hover:opacity-100'}"
							onclick={() => (selectedImage = img)}
						>
							<img src={img} alt="" class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		{/if}

		{#if project.longDescription}
			<div class="mt-12">
				<h2 class="text-secondary-200 mb-4 text-sm font-bold tracking-widest uppercase">
					About this project
				</h2>
				<p class="text-secondary-50/80 max-w-3xl text-lg leading-relaxed whitespace-pre-line">
					{project.longDescription}
				</p>
			</div>
		{/if}
	</section>
</main>
