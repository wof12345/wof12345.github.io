<script>
	import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconFileCv } from '@tabler/icons-svelte';
	import { author } from '$lib/seo';
	import { headline, tagline } from '$lib/data/builder';

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

<div class="flex max-w-xl flex-col items-start gap-6 max-sm:mt-[30vh]">
	<img
		src="/dev/pp.png"
		alt={author}
		class="size-28 rounded-full object-cover ring-1 ring-white/20 sm:size-36"
		data-reveal
		style:--i={0}
	/>

	<div class="flex flex-col gap-2">
		<p class="text-sm tracking-[0.35em] text-white/60 uppercase" data-reveal style:--i={1}>
			{author}
		</p>
		<h1 class="text-6xl font-light tracking-tight sm:text-8xl" data-reveal style:--i={2}>
			{headline}
		</h1>
	</div>

	<p class="max-w-md text-lg leading-relaxed text-white/70" data-reveal style:--i={3}>
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
		Scroll to travel ↓
	</p>
</div>
