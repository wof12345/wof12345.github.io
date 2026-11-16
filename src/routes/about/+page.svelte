<script>
	import {
		IconChevronDown,
		IconMountain,
		IconSun,
		IconTargetArrow,
		IconHeartHandshake,
		IconSparkles
	} from '@tabler/icons-svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Seo from '$lib/components/Seo.svelte';
	import SpacePage from '$lib/layouts/space/SpacePage.svelte';
	import { intro, quickFacts, currently, panels } from '$lib/data/about-me';

	// Map the icon names stored in data → the imported components.
	/** @type {Record<string, typeof IconSparkles>} */
	const icons = { IconMountain, IconSun, IconTargetArrow, IconHeartHandshake };

	// Track which panel is open. First one starts expanded.
	let openId = $state(panels[0]?.id ?? null);

	/** @param {string} id */
	function toggle(id) {
		openId = openId === id ? null : id;
	}

	// Reveal order: header (0–2), facts (3), panels, then the "Currently" block.
	const panelStart = 4;
	const currentlyStart = panelStart + panels.length;
</script>

<Seo
	title="More about me · Atif Bin Ferdous"
	description="The personal side of Atif Bin Ferdous — hobbies, lifestyle, ambitions, and what I care about beyond the code."
	canonical="/about"
	type="profile"
	keywords={['about Atif Bin Ferdous', 'builder hobbies', 'developer bio']}
/>

<SpacePage back={{ href: '/#about', label: 'Home' }}>
	<header class="flex flex-col gap-5">
		<p
			data-reveal
			style:--i={0}
			class="inline-flex items-center gap-2 text-xs tracking-[0.35em] text-white/50 uppercase"
		>
			<IconSparkles size={14} /> The personal bit
		</p>
		<h1 data-reveal style:--i={1} class="text-5xl font-light tracking-tight md:text-7xl">
			More about me
		</h1>
		<div data-reveal style:--i={2} class="flex max-w-xl flex-col gap-4">
			{#each intro as paragraph (paragraph)}
				<p class="text-lg leading-relaxed text-white/75">{paragraph}</p>
			{/each}
		</div>
		<ul data-reveal style:--i={3} class="mt-2 flex flex-wrap gap-2.5">
			{#each quickFacts as fact (fact.label)}
				<li
					class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm backdrop-blur-md"
				>
					<span class="text-white/45">{fact.label}</span>
					<span class="text-white/25">·</span>
					<span>{fact.value}</span>
				</li>
			{/each}
		</ul>
	</header>

	<section class="mt-16 flex flex-col gap-4" aria-label="Details">
		{#each panels as panel, i (panel.id)}
			{@const Icon = icons[panel.icon] ?? IconSparkles}
			{@const open = openId === panel.id}
			<div data-reveal style:--i={panelStart + i}>
				<div
					class="overflow-hidden rounded-2xl border bg-white/[0.04] backdrop-blur-md transition-all duration-300"
					style:border-color={open ? `${panel.accent}66` : 'rgb(255 255 255 / 0.1)'}
					style:box-shadow={open ? `0 18px 50px -28px ${panel.accent}` : 'none'}
				>
					<button
						type="button"
						onclick={() => toggle(panel.id)}
						aria-expanded={open}
						class="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-white/[0.03] md:px-7 md:py-6"
					>
						<span
							class="grid size-11 shrink-0 place-items-center rounded-full border transition-transform duration-300"
							class:scale-110={open}
							style:border-color="{panel.accent}55"
							style:color={panel.accent}
							style:box-shadow={open ? `0 0 18px ${panel.accent}55` : 'none'}
						>
							<Icon size={22} stroke={1.5} />
						</span>
						<span class="flex min-w-0 flex-col">
							<span class="text-lg font-medium md:text-xl">{panel.title}</span>
							<span class="truncate text-sm text-white/55">{panel.summary}</span>
						</span>
						<IconChevronDown
							size={20}
							class="ml-auto shrink-0 text-white/40 transition-transform duration-300 {open
								? 'rotate-180'
								: ''}"
						/>
					</button>

					{#if open}
						<div transition:slide={{ duration: 320, easing: cubicOut }} class="px-5 pb-6 md:px-7">
							<div class="flex flex-col gap-3 border-t border-white/10 pt-5 md:pl-15">
								{#each panel.body as paragraph (paragraph)}
									<p class="leading-relaxed text-white/75">{paragraph}</p>
								{/each}
								{#if panel.tags?.length}
									<ul class="mt-2 flex flex-wrap gap-2">
										{#each panel.tags as tag (tag)}
											<li
												class="rounded-full border px-3 py-1 text-xs"
												style:border-color="{panel.accent}44"
												style:color={panel.accent}
											>
												{tag}
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</section>

	<section class="mt-16" aria-labelledby="currently">
		<h2
			id="currently"
			data-reveal
			style:--i={currentlyStart}
			class="mb-6 text-xs tracking-[0.35em] text-white/50 uppercase"
		>
			Currently
		</h2>
		<div class="grid gap-3 sm:grid-cols-2">
			{#each currently as item, i (item.label)}
				<div
					data-reveal
					style:--i={currentlyStart + 1 + i}
					class="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
				>
					<span class="text-[11px] tracking-[0.25em] text-white/45 uppercase">{item.label}</span>
					<span class="leading-relaxed text-white/85">{item.value}</span>
				</div>
			{/each}
		</div>
	</section>
</SpacePage>
