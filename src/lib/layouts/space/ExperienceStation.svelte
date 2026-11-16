<script>
	import { IconArrowUpRight } from '@tabler/icons-svelte';
	import { companies } from '$lib/data/companies';
</script>

<div class="flex max-w-4xl flex-col gap-8">
	<header class="flex flex-col gap-2">
		<p data-reveal style:--i={0} class="text-xs tracking-[0.35em] text-white/50 uppercase">
			Experience
		</p>
		<h2 data-reveal style:--i={1} class="text-4xl font-light sm:text-5xl">
			Places I've built things
		</h2>
	</header>

	<ol data-scrollable class="relative flex max-h-[62vh] flex-col overflow-y-auto pr-2">
		{#each companies as c, i (c.id)}
			<li data-reveal style:--i={i + 2} class="relative pb-6 pl-10 last:pb-0">
				<!-- orbit line + node -->
				{#if i < companies.length - 1}
					<span class="absolute top-4 bottom-0 left-[7px] w-px bg-white/10"></span>
				{/if}
				<span
					class="absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full border"
					style:border-color="{c.color}99"
				>
					<span
						class="size-[7px] rounded-full"
						style:background={c.color}
						style:box-shadow="0 0 12px {c.color}"
					></span>
				</span>

				<a
					href="/company/{c.id}"
					class="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition hover:border-white/30 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
				>
					<div class="flex flex-col gap-1">
						<p class="text-xs tracking-[0.2em] text-white/45 uppercase">
							{c.period} · {c.type}
						</p>
						<h3 class="text-xl font-medium">
							{c.role} <span class="text-white/40">at</span>
							<span style:color={c.color}>{c.name}</span>
						</h3>
						<p class="text-sm text-white/65">{c.description[0]}</p>
					</div>
					<span
						class="flex shrink-0 items-center gap-1 text-sm text-white/50 transition group-hover:text-white"
					>
						Details
						<IconArrowUpRight
							size={16}
							class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
