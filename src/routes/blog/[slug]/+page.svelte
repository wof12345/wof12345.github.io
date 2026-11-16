<script>
	import Seo from '$lib/components/Seo.svelte';
	import SpacePage from '$lib/layouts/space/SpacePage.svelte';
	import { absoluteUrl, author } from '$lib/seo';

	let { data } = $props();

	let Content = $derived(data.content);

	const articleJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: data.meta.title ?? data.slug,
			description: data.meta.excerpt ?? undefined,
			datePublished: data.meta.date ?? undefined,
			keywords: Array.isArray(data.meta.tags) ? data.meta.tags.join(', ') : undefined,
			author: { '@type': 'Person', name: author },
			url: absoluteUrl(`/blog/${data.slug}`),
			mainEntityOfPage: absoluteUrl(`/blog/${data.slug}`)
		})
	);

	/** @param {string | undefined} d */
	function formatDate(d) {
		if (!d) return '';
		const date = new Date(d);
		if (Number.isNaN(date.getTime())) return d;
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<Seo
	title="{data.meta.title ?? data.slug} · Atif Bin Ferdous"
	description={data.meta.excerpt ??
		`Read "${data.meta.title ?? data.slug}" on Atif Bin Ferdous's blog.`}
	canonical="/blog/{data.slug}"
	type="article"
	keywords={Array.isArray(data.meta.tags) ? data.meta.tags : []}
	jsonLd={articleJsonLd}
/>

<SpacePage back={{ href: '/blog', label: 'All posts' }} revealKey={data.slug}>
	<header class="flex flex-col gap-4">
		<div
			data-reveal
			style:--i={0}
			class="flex flex-wrap items-center gap-3 text-xs tracking-[0.2em] text-white/45 uppercase"
		>
			{#if data.meta.date}
				<span>{formatDate(data.meta.date)}</span>
			{/if}
			{#if data.meta.tags?.length}
				<span class="text-white/25">·</span>
				<span class="flex flex-wrap gap-2 tracking-normal normal-case">
					{#each data.meta.tags as tag (tag)}
						<span class="rounded-full border border-white/10 px-2.5 py-0.5 text-white/60"
							>{tag}</span
						>
					{/each}
				</span>
			{/if}
		</div>

		<h1 data-reveal style:--i={1} class="text-4xl font-light tracking-tight md:text-6xl">
			{data.meta.title ?? data.slug}
		</h1>

		{#if data.meta.excerpt}
			<p data-reveal style:--i={2} class="max-w-2xl text-lg leading-relaxed text-white/70">
				{data.meta.excerpt}
			</p>
		{/if}
	</header>

	<!-- Glass panel: long-form text needs a calmer backdrop than the open scene. -->
	<article
		data-reveal
		style:--i={3}
		class="prose prose-invert prose-headings:scroll-mt-24 prose-headings:font-medium prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/60 prose-code:text-white prose-a:text-white prose-a:decoration-white/40 hover:prose-a:decoration-white mt-12 max-w-none rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-10"
	>
		<Content />
	</article>
</SpacePage>
