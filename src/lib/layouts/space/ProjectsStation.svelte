<script>
	import projects from '$lib/data/projects.json';
</script>

<div class="flex max-w-6xl flex-col gap-8">
	<header class="flex flex-col gap-2">
		<p class="text-xs tracking-[0.35em] text-white/50 uppercase">Things I've built</p>
		<h2 class="text-4xl font-light sm:text-5xl">Projects</h2>
	</header>

	<div
		data-scrollable
		class="grid max-h-[62vh] gap-4 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3"
	>
		{#each projects as p (p.id)}
			<a
				href="/projects/{p.id}"
				class="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md transition hover:border-white/30"
			>
				{#if p.image}
					<img
						src={p.image}
						alt=""
						loading="lazy"
						class="aspect-video w-full object-cover object-top opacity-80 transition group-hover:opacity-100"
					/>
				{/if}
				<div class="flex flex-col gap-2 p-5">
					<div class="flex items-baseline justify-between gap-2">
						<h3 class="text-lg font-medium">{p.name}</h3>
						<span class="text-xs text-white/40">{p.period}</span>
					</div>
					<p class="line-clamp-3 text-sm text-white/65">{p.description}</p>
					<ul class="flex flex-wrap gap-1.5 pt-1">
						{#each p.tags.slice(0, 4) as tag (tag)}
							<li class="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-white/55">
								{tag}
							</li>
						{/each}
					</ul>
				</div>
			</a>
		{/each}
	</div>
</div>
