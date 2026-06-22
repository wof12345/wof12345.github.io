<script>
	import {
		IconArrowLeft,
		IconChevronDown,
		IconMountain,
		IconSun,
		IconTargetArrow,
		IconHeartHandshake,
		IconSparkles
	} from '@tabler/icons-svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Reveal from '$lib/components/Animated/Entity/Reveal.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { intro, quickFacts, currently, panels } from '$lib/data/about-me';

	// Map the icon names stored in data → the imported components.
	const icons = {
		IconMountain,
		IconSun,
		IconTargetArrow,
		IconHeartHandshake
	};

	// Track which panel is open. First one starts expanded.
	let openId = $state(panels[0]?.id ?? null);

	function toggle(id) {
		openId = openId === id ? null : id;
	}
</script>

<Seo
	title="More about me · Atif Bin Ferdous"
	description="The personal side of Atif Bin Ferdous — hobbies, lifestyle, ambitions, and what I care about beyond the code."
	canonical="/about"
	type="profile"
	keywords={['about Atif Bin Ferdous', 'software engineer hobbies', 'developer bio']}
/>

<main class="bg-tertiary-950 min-h-screen w-full text-white">
	<header class="relative w-full overflow-hidden px-6 py-20 md:py-28">
		<div
			class="pointer-events-none absolute inset-0"
			style="background: radial-gradient(60% 80% at 80% 0%, var(--color-tertiary-700) 0%, transparent 60%), var(--color-tertiary-800);"
		></div>

		<div class="relative mx-auto flex max-w-3xl flex-col gap-5">
			<a
				href="/#about"
				class="text-tertiary-200 hover:text-white inline-flex w-fit items-center gap-2 text-sm font-semibold transition-colors"
			>
				<IconArrowLeft size={18} />
				<span>Back to about</span>
			</a>

			<Reveal y={20}>
				<p
					class="text-tertiary-200 inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase"
				>
					<IconSparkles size={16} />
					The personal bit
				</p>
				<h1 class="mt-3 text-4xl font-bold md:text-6xl">More about me</h1>
				<div class="mt-6 flex max-w-xl flex-col gap-4">
					{#each intro as paragraph}
						<p class="text-tertiary-50/80 text-lg leading-relaxed">{paragraph}</p>
					{/each}
				</div>
			</Reveal>

			<Reveal delay={120} y={18}>
				<div class="mt-2 flex flex-wrap gap-2.5">
					{#each quickFacts as fact}
						<span
							class="bg-tertiary-700/50 ring-tertiary-300/15 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm ring-1"
						>
							<span class="text-tertiary-300 font-semibold">{fact.label}</span>
							<span class="text-tertiary-50/60">·</span>
							<span class="font-semibold">{fact.value}</span>
						</span>
					{/each}
				</div>
			</Reveal>
		</div>
	</header>

	<section class="mx-auto max-w-3xl px-6 py-14 md:py-20">
		<!-- Expandable panels -->
		<div class="flex flex-col gap-4">
			{#each panels as panel, i}
				{@const Icon = icons[panel.icon] ?? IconSparkles}
				{@const open = openId === panel.id}
				<Reveal delay={i * 80} y={24}>
					<div
						class="bg-tertiary-800/50 ring-tertiary-300/10 overflow-hidden rounded-3xl ring-1 transition-all duration-300"
						class:ring-tertiary-300={open}
						style={open ? `box-shadow: 0 0 0 1px ${panel.accent}44, 0 18px 40px -24px ${panel.accent}88;` : ''}
					>
						<button
							type="button"
							onclick={() => toggle(panel.id)}
							aria-expanded={open}
							class="hover:bg-tertiary-800/80 flex w-full items-center gap-4 px-5 py-5 text-left transition-colors md:px-7 md:py-6"
						>
							<span
								class="grid size-12 shrink-0 place-items-center rounded-2xl transition-transform duration-300"
								class:scale-110={open}
								style="background: {panel.accent}1f; color: {panel.accent};"
							>
								<Icon size={26} stroke={1.75} />
							</span>

							<span class="flex min-w-0 flex-col">
								<span class="text-lg font-bold md:text-xl">{panel.title}</span>
								<span class="text-tertiary-50/60 truncate text-sm">{panel.summary}</span>
							</span>

							<IconChevronDown
								size={22}
								class="text-tertiary-300 ml-auto shrink-0 transition-transform duration-300 {open
									? 'rotate-180'
									: ''}"
							/>
						</button>

						{#if open}
							<div
								transition:slide={{ duration: 320, easing: cubicOut }}
								class="px-5 pb-6 md:px-7"
							>
								<div class="border-tertiary-300/10 border-t pt-5 pl-16">
									<div class="flex flex-col gap-3">
										{#each panel.body as paragraph}
											<p class="text-tertiary-50/80 leading-relaxed">{paragraph}</p>
										{/each}
									</div>

									{#if panel.tags?.length}
										<div class="mt-5 flex flex-wrap gap-2">
											{#each panel.tags as tag}
												<span
													class="rounded-full px-3 py-1 text-xs font-semibold ring-1"
													style="background: {panel.accent}14; color: {panel.accent}; border-color: {panel.accent}33;"
												>
													{tag}
												</span>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</Reveal>
			{/each}
		</div>

		<!-- "Currently" snapshot -->
		<div class="mt-16">
			<Reveal>
				<h2 class="text-tertiary-200 mb-6 text-sm font-bold tracking-widest uppercase">
					Currently
				</h2>
			</Reveal>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each currently as item, i}
					<Reveal delay={i * 70} y={18}>
						<div
							class="bg-tertiary-800/40 ring-tertiary-300/10 hover:ring-tertiary-300/30 flex flex-col gap-1 rounded-2xl p-5 ring-1 transition-all duration-200"
						>
							<span class="text-tertiary-300 text-xs font-bold tracking-widest uppercase">
								{item.label}
							</span>
							<span class="text-tertiary-50/90 leading-relaxed">{item.value}</span>
						</div>
					</Reveal>
				{/each}
			</div>
		</div>
	</section>
</main>
