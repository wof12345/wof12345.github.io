<script>
	import { IconArrowLeft, IconArrowRight, IconExternalLink } from '@tabler/icons-svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();

	let company = $derived(data.company);
	let relatedProjects = $derived(data.relatedProjects);
</script>

<Seo
	title="{company.name} · Atif Bin Ferdous"
	description="{company.role} at {company.name} ({company.period}). {company.tagline}"
	canonical="/company/{company.id}"
	keywords={['Atif Bin Ferdous experience', company.name, company.role, 'work history']}
/>

<main class="bg-tertiary-950 min-h-screen w-full text-white">
	<header
		class="relative w-full overflow-hidden px-6 py-16 md:py-24"
		style="background: linear-gradient(160deg, {company.color}26, transparent 70%), var(--color-tertiary-800);"
	>
		<div class="mx-auto flex max-w-4xl flex-col gap-5">
			<a
				href="/#about"
				class="text-tertiary-200 hover:text-white inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors"
			>
				<IconArrowLeft size={18} />
				<span>Back to about</span>
			</a>

			<div class="flex flex-wrap items-center gap-3 text-sm">
				<span
					class="rounded-md px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase ring-1 md:text-xs"
					style="background: {company.color}26; color: {company.color}; border-color: {company.color};"
				>
					{company.type}
				</span>
				<span class="text-tertiary-300 font-semibold tracking-widest uppercase">
					{company.period}
				</span>
			</div>

			<h1 class="text-4xl font-bold md:text-6xl" style="color: {company.color};">
				{company.name}
			</h1>
			<p class="text-tertiary-50 text-xl font-semibold md:text-2xl">{company.role}</p>

			{#if company.link}
				<a
					href={company.link}
					target="_blank"
					rel="noopener noreferrer"
					class="text-tertiary-950 mt-2 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-transform hover:scale-105"
					style="background: {company.color};"
				>
					<IconExternalLink size={18} />
					Visit website
				</a>
			{/if}
		</div>
	</header>

	<section class="mx-auto max-w-4xl px-6 py-12 md:py-16">
		<div class="text-tertiary-50/85 flex max-w-2xl flex-col gap-4 text-lg leading-relaxed">
			{#each company.description as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>

		{#if relatedProjects.length}
			<div class="mt-14">
				<h2 class="text-tertiary-200 mb-6 text-sm font-bold tracking-widest uppercase">
					Projects at {company.name}
				</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					{#each relatedProjects as project}
						<a
							href="/projects/{project.id}"
							class="bg-tertiary-800/50 hover:bg-tertiary-800 ring-tertiary-300/10 hover:ring-tertiary-300/30 group rounded-2xl p-5 ring-1 transition-all duration-200"
						>
							<h3 class="text-xl font-bold">{project.name}</h3>
							<p class="text-tertiary-50/70 mt-2 line-clamp-3 text-sm leading-relaxed">
								{project.description}
							</p>
							<span
								class="text-tertiary-300 group-hover:text-white mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-colors"
							>
								View project
								<IconArrowRight
									size={16}
									class="transition-transform duration-200 group-hover:translate-x-1"
								/>
							</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</section>
</main>
