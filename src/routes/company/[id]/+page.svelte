<script>
	import { IconArrowLeft, IconArrowRight, IconExternalLink } from '@tabler/icons-svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SpacePage from '$lib/layouts/space/SpacePage.svelte';

	let { data } = $props();

	let company = $derived(data.company);
	let relatedProjects = $derived(data.relatedProjects);
	let highlights = $derived(company.highlights ?? []);
</script>

<Seo
	title="{company.name} · Atif Bin Ferdous"
	description="{company.role} at {company.name} ({company.period}). {company.tagline}"
	canonical="/company/{company.id}"
	keywords={['Atif Bin Ferdous experience', company.name, company.role, 'work history']}
/>

<!-- revealKey: next/previous links reuse this component, so replay the reveal per company. -->
<SpacePage back={{ href: '/#experience', label: 'Experience' }} width="wide" revealKey={company.id}>
	<header class="flex max-w-3xl flex-col gap-5">
		<p data-reveal style:--i={0} class="text-xs tracking-[0.3em] text-white/50 uppercase">
			<span style:color={company.color}>{company.type}</span> · {company.period}
		</p>
		<h1
			data-reveal
			style:--i={1}
			class="text-4xl font-light tracking-tight break-words sm:text-5xl md:text-7xl"
		>
			{company.name}
		</h1>
		<p data-reveal style:--i={2} class="text-xl text-white/80 md:text-2xl">{company.role}</p>
		<p data-reveal style:--i={3} class="text-white/50">{company.tagline}</p>

		{#if company.link}
			<div data-reveal style:--i={4}>
				<a
					href={company.link}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-white/60"
				>
					<IconExternalLink size={16} stroke={1.5} />
					Visit website
				</a>
			</div>
		{/if}
	</header>

	<section class="mt-14 flex flex-col gap-16">
		<div class="flex max-w-2xl flex-col gap-4 text-lg leading-relaxed text-white/75">
			{#each company.description as paragraph, i (paragraph)}
				<p data-reveal style:--i={5 + i}>{paragraph}</p>
			{/each}
		</div>

		{#if highlights.length}
			<div class="flex flex-col gap-6">
				<h2 data-reveal style:--i={7} class="text-xs tracking-[0.3em] text-white/50 uppercase">
					What I shipped
				</h2>
				<ol class="grid gap-4 md:grid-cols-2">
					{#each highlights as item, i (item)}
						<li
							data-reveal
							style:--i={8 + i}
							class="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
						>
							<span class="font-mono text-sm" style:color={company.color}>
								{String(i + 1).padStart(2, '0')}
							</span>
							<p class="text-sm leading-relaxed text-white/80">{item}</p>
						</li>
					{/each}
				</ol>
			</div>
		{/if}

		{#if relatedProjects.length}
			<div class="flex flex-col gap-6">
				<h2
					data-reveal
					style:--i={8 + highlights.length}
					class="text-xs tracking-[0.3em] text-white/50 uppercase"
				>
					Built at {company.name}
				</h2>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each relatedProjects as project, i (project.id)}
						<div data-reveal style:--i={9 + highlights.length + i}>
							<a
								href="/projects/{project.id}"
								class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md transition hover:border-white/30"
							>
								{#if project.image}
									<img
										src={project.image}
										alt=""
										loading="lazy"
										class="aspect-video w-full object-cover object-top opacity-80 transition group-hover:opacity-100"
									/>
								{/if}
								<div class="flex flex-col gap-2 p-5">
									<div class="flex items-baseline justify-between gap-2">
										<h3 class="text-lg font-medium">{project.name}</h3>
										<span class="text-xs text-white/40">{project.period}</span>
									</div>
									<p class="line-clamp-3 text-sm text-white/65">{project.description}</p>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if data.newer || data.older}
			<nav
				aria-label="Other experience"
				class="flex flex-wrap justify-between gap-4 border-t border-white/10 pt-8"
			>
				{#if data.newer}
					<a href="/company/{data.newer.id}" class="group flex flex-col gap-1">
						<span class="flex items-center gap-1 text-xs tracking-[0.3em] text-white/40 uppercase">
							<IconArrowLeft size={14} /> More recent
						</span>
						<span
							class="text-lg transition-colors group-hover:text-white"
							style:color={data.newer.color}
						>
							{data.newer.name}
						</span>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if data.older}
					<a href="/company/{data.older.id}" class="group flex flex-col items-end gap-1">
						<span class="flex items-center gap-1 text-xs tracking-[0.3em] text-white/40 uppercase">
							Earlier <IconArrowRight size={14} />
						</span>
						<span
							class="text-lg transition-colors group-hover:text-white"
							style:color={data.older.color}
						>
							{data.older.name}
						</span>
					</a>
				{/if}
			</nav>
		{/if}
	</section>
</SpacePage>
