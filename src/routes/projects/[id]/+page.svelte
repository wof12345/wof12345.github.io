<script>
	import {
		IconBrandGithub,
		IconExternalLink,
		IconChevronLeft,
		IconChevronRight,
		IconX
	} from '@tabler/icons-svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SpacePage from '$lib/layouts/space/SpacePage.svelte';
	import { companiesByName } from '$lib/data/companies';

	let { data } = $props();

	let project = $derived(data.project);
	let company = $derived(project.company ? companiesByName[project.company] : undefined);
	let selectedImage = $state(data.project.image);
	let images = $state([data.project.image].filter(Boolean));
	let isLoading = $state(false);
	let isLightboxOpen = $state(false);

	function openLightbox() {
		isLightboxOpen = true;
	}

	function closeLightbox() {
		isLightboxOpen = false;
	}

	function handleKeydown(e) {
		if (!isLightboxOpen) return;
		if (e.key === 'Escape') {
			closeLightbox();
		} else if (e.key === 'ArrowRight' && images.length > 1) {
			const i = images.indexOf(selectedImage);
			selectedImage = images[(i + 1) % images.length];
		} else if (e.key === 'ArrowLeft' && images.length > 1) {
			const i = images.indexOf(selectedImage);
			selectedImage = images[(i - 1 + images.length) % images.length];
		}
	}

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

		for (let i = 1; i <= 20; i++) {
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

<Seo
	title="{project.name} · Atif Bin Ferdous"
	description={project.description}
	canonical="/projects/{project.id}"
	image={project.image ?? undefined}
	keywords={[project.name, ...(project.tags ?? []), 'Atif Bin Ferdous project', 'case study']}
/>

<svelte:window onkeydown={handleKeydown} />

<SpacePage back={{ href: '/#projects', label: 'Projects' }} width="wide" revealKey={project.id}>
	<header class="flex max-w-3xl flex-col gap-5">
		<div
			data-reveal
			style:--i={0}
			class="flex flex-wrap items-center gap-3 text-xs tracking-[0.3em] text-white/50 uppercase"
		>
			{#if project.period}<span>{project.period}</span>{/if}
			{#if project.company}
				<span class="text-white/25">·</span>
				{#if company}
					<a
						href="/company/{company.id}"
						class="transition-opacity hover:opacity-80"
						style:color={company.color}
					>
						{project.company}
					</a>
				{:else}
					<span>{project.company}</span>
				{/if}
			{/if}
		</div>

		<h1 data-reveal style:--i={1} class="text-5xl font-light tracking-tight md:text-7xl">
			{project.name}
		</h1>

		<p data-reveal style:--i={2} class="text-lg leading-relaxed text-white/75">
			{project.description}
		</p>

		{#if project.tags?.length}
			<ul data-reveal style:--i={3} class="flex flex-wrap gap-2">
				{#each project.tags as tag (tag)}
					<li class="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">{tag}</li>
				{/each}
			</ul>
		{/if}

		{#if project.links?.live || project.links?.github}
			<div data-reveal style:--i={4} class="mt-1 flex flex-wrap gap-3">
				{#if project.links?.live}
					<a
						href={project.links.live}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/85"
					>
						<span class="relative flex size-1.5">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"
							></span>
							<span class="relative inline-flex size-1.5 rounded-full bg-emerald-500"></span>
						</span>
						Live site
						<IconExternalLink size={14} />
					</a>
				{/if}
				{#if project.links?.github}
					<a
						href={project.links.github}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-white/60"
					>
						<IconBrandGithub size={16} stroke={1.5} />
						GitHub
					</a>
				{/if}
			</div>
		{/if}
	</header>

	<section class="mt-14">
		{#if selectedImage}
			<div data-reveal style:--i={5}>
				<button
					type="button"
					onclick={openLightbox}
					class="group relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl"
				>
					<img
						src={selectedImage}
						alt={project.name}
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					/>
					{#if isLoading && images.length <= 1}
						<div class="absolute inset-0 flex items-center justify-center bg-black/20">
							<div
								class="h-8 w-8 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
							></div>
						</div>
					{/if}
				</button>

				{#if images.length > 1}
					<div data-scrollable class="mt-4 flex gap-3 overflow-x-auto pb-2">
						{#each images as img (img)}
							<button
								type="button"
								class="relative aspect-square w-24 flex-none overflow-hidden rounded-xl border transition-all hover:scale-[1.03] sm:w-28 md:w-32 {selectedImage ===
								img
									? 'border-white'
									: 'border-transparent opacity-60 hover:opacity-100'}"
								onclick={() => (selectedImage = img)}
							>
								<img src={img} alt="" class="h-full w-full object-cover" />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		{#if data.longDescription}
			<div
				data-reveal
				style:--i={6}
				class="mt-12 rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-10"
			>
				<h2 class="mb-4 text-xs tracking-[0.3em] text-white/50 uppercase">About this project</h2>
				<div class="max-w-3xl text-lg leading-relaxed text-white/80">
					<!-- Trusted, repo-authored HTML from src/lib/data/description. -->
					{@html data.longDescription}
				</div>
			</div>
		{/if}
	</section>
</SpacePage>

{#if isLightboxOpen && selectedImage}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-label="{project.name} image viewer"
		tabindex="-1"
		onclick={closeLightbox}
		onkeydown={(e) => e.key === 'Enter' && closeLightbox()}
	>
		<button
			type="button"
			class="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
			aria-label="Close"
			onclick={closeLightbox}
		>
			<IconX size={24} />
		</button>

		{#if images.length > 1}
			<button
				type="button"
				class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
				aria-label="Previous image"
				onclick={(e) => {
					e.stopPropagation();
					const i = images.indexOf(selectedImage);
					selectedImage = images[(i - 1 + images.length) % images.length];
				}}
			>
				<IconChevronLeft size={28} />
			</button>
			<button
				type="button"
				class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
				aria-label="Next image"
				onclick={(e) => {
					e.stopPropagation();
					const i = images.indexOf(selectedImage);
					selectedImage = images[(i + 1) % images.length];
				}}
			>
				<IconChevronRight size={28} />
			</button>
		{/if}

		<div class="contents" role="presentation" onclick={(e) => e.stopPropagation()}>
			<img
				src={selectedImage}
				alt={project.name}
				class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
			/>
		</div>
	</div>
{/if}
