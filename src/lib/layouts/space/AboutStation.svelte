<script>
	import { IconBrandGithub, IconBrandLinkedin, IconBrandWhatsapp } from '@tabler/icons-svelte';
	import { intro, quickFacts } from '$lib/data/about-me';
</script>

<div class="flex max-w-3xl flex-col gap-8">
	<header class="flex flex-col gap-2">
		<p class="text-xs tracking-[0.35em] text-white/50 uppercase">About</p>
		<h2 class="text-4xl font-light sm:text-5xl">From far enough away, it's all one system</h2>
	</header>

	<div class="flex flex-col gap-4 text-lg leading-relaxed text-white/75">
		{#each intro as paragraph (paragraph)}
			<p>{paragraph}</p>
		{/each}
	</div>

	<dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each quickFacts as fact (fact.label)}
			<div class="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
				<dt class="text-[11px] tracking-widest text-white/45 uppercase">{fact.label}</dt>
				<dd class="mt-1 text-sm">{fact.value}</dd>
			</div>
		{/each}
	</dl>

	<div class="flex flex-wrap gap-3">
		<a
			href="/about"
			class="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/85"
		>
			More about me
		</a>
		<a
			href="https://www.linkedin.com/in/atif-bin-ferdous-1b3602281"
			target="_blank"
			rel="noreferrer"
			class="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-white/50"
		>
			<IconBrandLinkedin size={18} stroke={1.5} /> LinkedIn
		</a>
		<a
			href="https://github.com/wof12345"
			target="_blank"
			rel="noreferrer"
			class="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-white/50"
		>
			<IconBrandGithub size={18} stroke={1.5} /> GitHub
		</a>
		<a
			href="https://wa.me/01680793142"
			target="_blank"
			rel="noreferrer"
			class="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-white/50"
		>
			<IconBrandWhatsapp size={18} stroke={1.5} /> WhatsApp
		</a>
	</div>
</div>
