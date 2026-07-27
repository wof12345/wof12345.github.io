<script>
	import { IconArrowLeft, IconArrowRight, IconSearch, IconX } from '@tabler/icons-svelte';
	import Reveal from '$lib/components/Animated/Entity/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';

	/**
	 * @typedef {Object} Post
	 * @property {string} slug
	 * @property {string} [title]
	 * @property {string} [excerpt]
	 * @property {string} [date]
	 * @property {string[]} [tags]
	 */

	/** @type {{ data: { posts: Post[] } }} */
	let { data } = $props();

	const TAG_LIMIT = 20;

	/** @type {string[]} */
	let selectedTags = $state([]); // multi-select filter
	let query = $state(''); // universal search across title, excerpt, tags…
	let showAllTags = $state(false); // expand past the first TAG_LIMIT

	// Every unique tag across all posts, sorted alphabetically.
	const allTags = $derived(
		Array.from(new Set(data.posts.flatMap((p) => p.tags ?? []))).sort((a, b) =>
			a.localeCompare(b)
		)
	);

	// Tags matching the search box — keeps relevant chips easy to click while searching.
	const matchingTags = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return q ? allTags.filter((t) => t.toLowerCase().includes(q)) : allTags;
	});

	// Show only the first TAG_LIMIT, but never hide a tag that's currently selected.
	const visibleTags = $derived.by(() => {
		const base = showAllTags ? matchingTags : matchingTags.slice(0, TAG_LIMIT);
		const missingSelected = matchingTags.filter(
			(t) => selectedTags.includes(t) && !base.includes(t)
		);
		return [...base, ...missingSelected];
	});

	const hiddenCount = $derived(Math.max(matchingTags.length - TAG_LIMIT, 0));

	// A post passes if it matches every selected tag filter AND the free-text query
	// (checked against title, excerpt, slug and tags).
	const filteredPosts = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return data.posts.filter((p) => {
			const tagOk = selectedTags.length === 0 || p.tags?.some((t) => selectedTags.includes(t));
			if (!tagOk) return false;
			if (!q) return true;
			const haystack = [p.title, p.excerpt, p.slug, ...(p.tags ?? [])]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			return haystack.includes(q);
		});
	});

	function toggleTag(tag) {
		selectedTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
	}

	function clearTags() {
		selectedTags = [];
	}

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
	title="Blog · Atif Bin Ferdous"
	description="Writings by Atif Bin Ferdous on software engineering, web development, projects, and developer tools."
	canonical="/blog"
	keywords={['engineering blog', 'web development articles', 'Svelte tutorials', 'developer writing']}
/>

<main class="bg-primary-950 min-h-screen w-full text-white">
	<header class="bg-primary-800 relative w-full px-6 py-20 md:py-28">
		<div class="mx-auto flex max-w-3xl flex-col gap-4">
			<a
				href="/#about"
				class="text-primary-200 hover:text-white inline-flex items-center gap-2 text-sm font-semibold transition-colors"
			>
				<IconArrowLeft size={18} />
				<span>Back to portfolio</span>
			</a>
			<p class="text-primary-300 text-sm font-semibold tracking-widest uppercase">
				The blog
			</p>
			<h1 class="text-4xl font-bold md:text-6xl">Notes &amp; writing</h1>
			<p class="text-primary-100/80 max-w-xl text-lg leading-relaxed">
				Thoughts on engineering, post-mortems on the projects I've built, and things I keep
				learning along the way.
			</p>
		</div>
	</header>

	<section class="mx-auto max-w-3xl px-6 py-16 md:py-24">
		{#if data.posts.length === 0}
			<p class="text-primary-200/70 text-center">
				No posts yet — drop a <code class="bg-primary-800 rounded px-1.5 py-0.5">.md</code> file
				into <code class="bg-primary-800 rounded px-1.5 py-0.5">src/posts/</code> to publish one.
			</p>
		{:else}
			{#if allTags.length > 0}
				<div class="mb-10 flex flex-col gap-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<label class="bg-primary-900/60 ring-primary-300/10 focus-within:ring-primary-300/40 flex w-full items-center gap-2 rounded-full px-4 py-2 ring-1 transition-all sm:max-w-xs">
							<IconSearch size={18} class="text-primary-400 shrink-0" />
							<input
								type="search"
								bind:value={query}
								placeholder="Search posts…"
								aria-label="Search posts by title, tag or description"
								class="placeholder:text-primary-400/70 w-full bg-transparent text-sm text-white outline-none"
							/>
						</label>

						{#if selectedTags.length > 0}
							<button
								type="button"
								onclick={clearTags}
								class="text-primary-300 hover:text-white inline-flex items-center gap-1 text-sm font-semibold transition-colors"
							>
								<IconX size={16} />
								Clear {selectedTags.length} filter{selectedTags.length > 1 ? 's' : ''}
							</button>
						{/if}
					</div>

					<div class="flex flex-wrap gap-2" role="group" aria-label="Filter posts by tag">
						{#each visibleTags as tag (tag)}
							{@const active = selectedTags.includes(tag)}
							<button
								type="button"
								aria-pressed={active}
								onclick={() => toggleTag(tag)}
								class="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors {active
									? 'bg-primary-300 text-primary-950'
									: 'bg-primary-800/60 text-primary-100 hover:bg-primary-700/70'}"
							>
								{tag}
							</button>
						{/each}

						{#if matchingTags.length === 0}
							<span class="text-primary-200/60 py-1.5 text-sm">No tags match “{query}”.</span>
						{/if}
					</div>

					{#if hiddenCount > 0 && query.trim() === ''}
						<button
							type="button"
							onclick={() => (showAllTags = !showAllTags)}
							class="text-primary-300 hover:text-white self-start text-sm font-semibold transition-colors"
						>
							{showAllTags ? 'Show fewer tags' : `Show all tags (+${hiddenCount})`}
						</button>
					{/if}
				</div>
			{/if}

			{#if filteredPosts.length === 0}
				<p class="text-primary-200/70 text-center">No posts match the selected tags.</p>
			{:else}
			<ul class="flex flex-col gap-8">
				{#each filteredPosts as post, i (post.slug)}
					<li>
						<Reveal delay={i * 80} y={28}>
						<a
							href="/blog/{post.slug}"
							class="bg-primary-900/60 hover:bg-primary-800 ring-primary-300/10 hover:ring-primary-300/30 group block rounded-2xl p-6 ring-1 transition-all duration-200 md:p-8"
						>
							<div class="flex flex-col gap-3">
								<div class="flex flex-wrap items-center gap-3 text-sm">
									<span class="text-primary-300 font-semibold">
										{formatDate(post.date)}
									</span>
									{#if post.tags?.length}
										<span class="text-primary-400">·</span>
										<div class="flex flex-wrap gap-2">
											{#each post.tags as tag}
												<span
													class="bg-primary-700/60 text-primary-100 rounded-full px-2.5 py-0.5 text-xs font-semibold"
												>
													{tag}
												</span>
											{/each}
										</div>
									{/if}
								</div>

								<h2
									class="group-hover:text-primary-100 text-2xl font-bold transition-colors md:text-3xl"
								>
									{post.title ?? post.slug}
								</h2>

								{#if post.excerpt}
									<p class="text-primary-100/70 leading-relaxed">{post.excerpt}</p>
								{/if}

								<span
									class="text-primary-300 group-hover:text-white mt-1 inline-flex items-center gap-1 text-sm font-semibold transition-colors"
								>
									Read post
									<IconArrowRight
										size={16}
										class="transition-transform duration-200 group-hover:translate-x-1"
									/>
								</span>
							</div>
						</a>
						</Reveal>
					</li>
				{/each}
			</ul>
			{/if}
		{/if}
	</section>
</main>
