<script>
	import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconFileCv } from '@tabler/icons-svelte';
	import { author } from '$lib/seo';
	import { headline, tagline } from '$lib/data/builder';

	/** @type {{ revealed: boolean }} */
	let { revealed } = $props();

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

	// Staggered foreground reveal, in ms after the planets recede.
	/** @param {number} ms */
	const reveal = (ms) =>
		`opacity:${revealed ? 1 : 0};transform:translateY(${revealed ? 0 : 16}px);transition:opacity 900ms ease ${ms}ms, transform 900ms ease ${ms}ms;`;
</script>

<div class="flex max-w-xl flex-col items-start gap-6 max-sm:mt-[30vh]">
	<img
		src="/dev/pp.png"
		alt={author}
		class="size-28 rounded-full object-cover ring-1 ring-white/20 sm:size-36"
		style={reveal(0)}
	/>

	<div class="flex flex-col gap-2">
		<p class="text-sm tracking-[0.35em] text-white/60 uppercase" style={reveal(150)}>{author}</p>
		<h1 class="text-6xl font-light tracking-tight sm:text-8xl" style={reveal(300)}>
			{headline}
		</h1>
	</div>

	<p class="max-w-md text-lg leading-relaxed text-white/70" style={reveal(500)}>{tagline}</p>

	<ul class="flex gap-3" style={reveal(700)}>
		{#each socials as s (s.label)}
			<li>
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

	<p class="text-xs tracking-[0.3em] text-white/40 uppercase" style={reveal(1400)}>
		Scroll to travel ↓
	</p>
</div>
