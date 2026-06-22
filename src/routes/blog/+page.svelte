<script>
	import { IconArrowLeft, IconArrowRight } from '@tabler/icons-svelte';
	import Reveal from '$lib/components/Animated/Entity/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();

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
			<ul class="flex flex-col gap-8">
				{#each data.posts as post, i}
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
	</section>
</main>
