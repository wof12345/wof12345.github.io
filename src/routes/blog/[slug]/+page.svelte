<script>
	import { IconArrowLeft } from '@tabler/icons-svelte';

	let { data } = $props();

	let Content = $derived(data.content);

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

<svelte:head>
	<title>{data.meta.title ?? data.slug} · Atif</title>
	{#if data.meta.excerpt}
		<meta name="description" content={data.meta.excerpt} />
	{/if}
</svelte:head>

<main class="bg-primary-950 min-h-screen w-full text-white">
	<header class="bg-primary-800 w-full px-6 py-16 md:py-20">
		<div class="mx-auto flex max-w-3xl flex-col gap-4">
			<a
				href="/blog"
				class="text-primary-200 hover:text-white inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors"
			>
				<IconArrowLeft size={18} />
				<span>All posts</span>
			</a>

			<div class="flex flex-wrap items-center gap-3 text-sm">
				{#if data.meta.date}
					<span class="text-primary-300 font-semibold">
						{formatDate(data.meta.date)}
					</span>
				{/if}
				{#if data.meta.tags?.length}
					<span class="text-primary-400">·</span>
					<div class="flex flex-wrap gap-2">
						{#each data.meta.tags as tag}
							<span
								class="bg-primary-700/60 text-primary-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
							>
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<h1 class="text-3xl font-bold md:text-5xl">
				{data.meta.title ?? data.slug}
			</h1>

			{#if data.meta.excerpt}
				<p class="text-primary-100/80 max-w-2xl leading-relaxed">
					{data.meta.excerpt}
				</p>
			{/if}
		</div>
	</header>

	<article
		class="prose prose-invert prose-headings:scroll-mt-24 prose-pre:bg-primary-900 prose-pre:ring-1 prose-pre:ring-primary-300/10 prose-code:text-primary-200 prose-a:text-primary-300 hover:prose-a:text-white mx-auto w-full max-w-3xl px-6 py-12 md:py-20"
	>
		<Content />
	</article>
</main>
