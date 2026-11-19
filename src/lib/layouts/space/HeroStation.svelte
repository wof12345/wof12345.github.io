<script>
	import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconFileCv } from '@tabler/icons-svelte';
	import { author } from '$lib/seo';
	import { headline, headlineDefinition as def, tagline } from '$lib/data/builder';

	const socials = [
		{ href: 'https://github.com/wof12345', label: 'GitHub', icon: IconBrandGithub },
		{
			href: 'https://www.linkedin.com/in/atif-bin-ferdous-1b3602281',
			label: 'LinkedIn',
			icon: IconBrandLinkedin
		},
		{ href: 'https://x.com/wof1234567890', label: 'X', icon: IconBrandX },
		{ href: '/cv', label: 'CV', icon: IconFileCv }
	];
</script>

<div class="flex max-w-xl flex-col items-start gap-5 sm:gap-6">
	<img
		src="/dev/pp.png"
		alt={author}
		class="size-24 rounded-full object-cover ring-1 ring-white/20 sm:size-36"
		data-reveal
		style:--i={0}
	/>

	<div class="flex flex-col gap-2">
		<p class="text-sm tracking-[0.35em] text-white/60 uppercase" data-reveal style:--i={1}>
			{author}
		</p>
		<h1 class="text-5xl font-light tracking-tight sm:text-8xl" data-reveal style:--i={2}>
			<!-- Hover or focus shows a dictionary-style definition. -->
			<button
				type="button"
				class="group relative inline-block cursor-help outline-none"
				aria-describedby="headline-definition"
			>
				{headline}
				<span
					id="headline-definition"
					role="tooltip"
					class="pointer-events-none absolute top-full left-0 z-30 mt-3 w-72 translate-y-1 rounded-xl border border-white/15 bg-black/70 p-4 text-left tracking-normal opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 sm:w-80"
				>
					<span class="block text-base font-normal text-white">
						{headline.toLowerCase()}
						<span class="ml-1 text-sm text-white/50">{def.pronunciation}</span>
					</span>
					<span class="mt-0.5 block text-xs text-white/40 italic">{def.partOfSpeech}</span>
					<span class="mt-2 block text-sm leading-relaxed text-white/75">{def.meaning}</span>
				</span>
			</button>
		</h1>
	</div>

	<p class="max-w-md text-base leading-relaxed text-white/70 sm:text-lg" data-reveal style:--i={3}>
		{tagline}
	</p>

	<ul class="flex gap-3">
		{#each socials as s, k (s.label)}
			<li data-reveal style:--i={4 + k}>
				<a
					href={s.href}
					target={s.href.startsWith('http') ? '_blank' : undefined}
					rel="noreferrer"
					aria-label={s.label}
					class="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur transition hover:border-white/50 hover:bg-white/10"
				>
					<s.icon size={20} stroke={1.5} />
				</a>
			</li>
		{/each}
	</ul>

	<p
		class="text-xs tracking-[0.3em] text-white/40 uppercase"
		data-reveal
		style:--i={4 + socials.length}
	>
		<span class="pointer-coarse:hidden">Scroll</span><span class="hidden pointer-coarse:inline"
			>Swipe</span
		> to travel ↓
	</p>
</div>
