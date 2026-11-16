<script>
	import { areas } from '$lib/data/builder';
</script>

<div class="flex max-w-5xl flex-col gap-8">
	<header class="flex flex-col gap-2">
		<p class="text-xs tracking-[0.35em] text-white/50 uppercase">What I build</p>
		<h2 class="text-4xl font-light sm:text-5xl">Agents, systems, and the platform underneath</h2>
	</header>

	<div data-scrollable class="grid max-h-[60vh] gap-4 overflow-y-auto md:grid-cols-3">
		{#each areas as area (area.id)}
			<article
				class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
			>
				<div class="flex flex-col gap-1">
					<h3 class="text-xl font-medium">{area.title}</h3>
					<p class="text-sm text-white/60">{area.summary}</p>
				</div>
				<ul class="flex flex-col gap-2 text-sm leading-relaxed text-white/80">
					{#each area.points as point (point)}
						<li class="flex gap-2"><span class="text-white/30">—</span>{point}</li>
					{/each}
				</ul>
				<ul class="mt-auto flex flex-wrap gap-1.5">
					{#each area.tags as tag (tag)}
						<li class="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/60">
							{tag}
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</div>
