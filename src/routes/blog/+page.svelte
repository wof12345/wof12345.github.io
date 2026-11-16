<script>
	import { IconArrowRight, IconSearch, IconX } from '@tabler/icons-svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SpacePage from '$lib/layouts/space/SpacePage.svelte';

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
		Array.from(new Set(data.posts.flatMap((p) => p.tags ?? []))).sort((a, b) => a.localeCompare(b))
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

	/** @param {string} tag */
	function toggleTag(tag) {
		selectedTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
	}

	function clearTags() {
		selectedTags = [];
	}

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
	title="Blog · Atif Bin Ferdous"
	description="Writings by Atif Bin Ferdous on building software, system design, projects, and developer tools."
	canonical="/blog"
	keywords={['engineering blog', 'system design articles', 'Svelte tutorials', 'developer writing']}
/>

<SpacePage back={{ href: '/#about', label: 'Home' }}>
	<header class="flex flex-col gap-4">
		<p data-reveal style:--i={0} class="text-xs tracking-[0.35em] text-white/50 uppercase">
			The blog
		</p>
		<h1 data-reveal style:--i={1} class="text-5xl font-light tracking-tight md:text-7xl">
			Notes &amp; writing
		</h1>
		<p data-reveal style:--i={2} class="max-w-xl text-lg leading-relaxed text-white/70">
			Thoughts on engineering, post-mortems on the things I've built, and what I keep learning along
			the way.
		</p>
	</header>

	<section class="mt-14">
		{#if data.posts.length === 0}
			<p data-reveal style:--i={3} class="text-center text-white/60">
				No posts yet — drop a <code class="rounded bg-white/10 px-1.5 py-0.5">.md</code> file into
				<code class="rounded bg-white/10 px-1.5 py-0.5">src/posts/</code> to publish one.
			</p>
		{:else}
			{#if allTags.length > 0}
				<div data-reveal style:--i={3} class="mb-10 flex flex-col gap-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<label
							class="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md transition-colors focus-within:border-white/40 sm:max-w-xs"
						>
							<IconSearch size={18} class="shrink-0 text-white/40" />
							<input
								type="search"
								bind:value={query}
								placeholder="Search posts…"
								aria-label="Search posts by title, tag or description"
								class="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
							/>
						</label>

						{#if selectedTags.length > 0}
							<button
								type="button"
								onclick={clearTags}
								class="inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-white"
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
								class="rounded-full border px-3.5 py-1 text-sm transition-colors {active
									? 'border-white bg-white text-black'
									: 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'}"
							>
								{tag}
							</button>
						{/each}

						{#if matchingTags.length === 0}
							<span class="py-1 text-sm text-white/50">No tags match “{query}”.</span>
						{/if}
					</div>

					{#if hiddenCount > 0 && query.trim() === ''}
						<button
							type="button"
							onclick={() => (showAllTags = !showAllTags)}
							class="self-start text-sm text-white/50 transition-colors hover:text-white"
						>
							{showAllTags ? 'Show fewer tags' : `Show all tags (+${hiddenCount})`}
						</button>
					{/if}
				</div>
			{/if}

			{#if filteredPosts.length === 0}
				<p class="text-center text-white/60">No posts match the selected tags.</p>
			{:else}
				<ul class="flex flex-col gap-5">
					{#each filteredPosts as post, i (post.slug)}
						<li data-reveal style:--i={4 + Math.min(i, 6)}>
							<a
								href="/blog/{post.slug}"
								class="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition hover:border-white/30 md:p-8"
							>
								<div
									class="flex flex-wrap items-center gap-3 text-xs tracking-[0.2em] text-white/45 uppercase"
								>
									<span>{formatDate(post.date)}</span>
									{#if post.tags?.length}
										<span class="text-white/25">·</span>
										<span class="flex flex-wrap gap-2 tracking-normal normal-case">
											{#each post.tags as tag (tag)}
												<span
													class="rounded-full border border-white/10 px-2.5 py-0.5 text-white/60"
												>
													{tag}
												</span>
											{/each}
										</span>
									{/if}
								</div>
								<h2 class="text-2xl font-medium md:text-3xl">{post.title ?? post.slug}</h2>
								{#if post.excerpt}
									<p class="leading-relaxed text-white/65">{post.excerpt}</p>
								{/if}
								<span
									class="mt-1 inline-flex items-center gap-1 text-sm text-white/50 transition-colors group-hover:text-white"
								>
									Read post
									<IconArrowRight
										size={16}
										class="transition-transform group-hover:translate-x-1"
									/>
								</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</section>
</SpacePage>
