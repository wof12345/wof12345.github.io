<script>
	import {
		IconArrowRight,
		IconBrandJavascript,
		IconBrandPython,
		IconBrandReact,
		IconBrandSvelte,
		IconBrandTailwind,
		IconBrandTypescript,
		IconBolt,
		IconDatabase,
		IconNotebook
	} from '@tabler/icons-svelte';

	const skills = [
		{ name: 'Svelte', icon: IconBrandSvelte },
		{ name: 'React', icon: IconBrandReact },
		{ name: 'TypeScript', icon: IconBrandTypescript },
		{ name: 'JavaScript', icon: IconBrandJavascript },
		{ name: 'Tailwind CSS', icon: IconBrandTailwind },
		{ name: 'Python', icon: IconBrandPython },
		{ name: 'PostgreSQL', icon: IconDatabase },
		{ name: 'FastAPI', icon: IconBolt }
	];

	const experience = [
		{
			role: 'Software Engineer',
			company: 'Freelance',
			period: '2023 — Present',
			description:
				'Designing and shipping full-stack web applications with a focus on clean UI, accessibility, and performance. Working across the stack from Svelte/React frontends to FastAPI and PostgreSQL backends.'
		},
		{
			role: 'Independent Developer',
			company: '',
			period: '2020 — 2023',
			description:
				'Self-taught my way through modern web development — front-end frameworks, server-side APIs, databases, and deployment — by building real projects end to end.'
		}
	];
</script>

<section id="about" class="bg-tertiary-800 w-full py-24 text-white md:py-32">
	<div class="mx-auto max-w-5xl px-6">
		<div class="mb-16 flex flex-col items-center text-center">
			<p class="text-tertiary-300 text-sm font-semibold tracking-widest uppercase">
				Who I am
			</p>
			<h2 class="mt-2 text-4xl font-bold md:text-5xl">About me</h2>
			<div class="bg-tertiary-300 mt-4 h-1 w-16 rounded-full"></div>
		</div>

		<div class="grid gap-10 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
			<div class="flex justify-center md:justify-start">
				<div
					class="ring-tertiary-300/30 aspect-square w-44 overflow-hidden rounded-3xl shadow-2xl ring-4 md:w-56"
				>
					<img src="/dev/pp.png" alt="Atif" class="h-full w-full object-cover" />
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<h3 class="text-2xl font-bold md:text-3xl">Hi again — I'm Atif</h3>
				<p class="text-tertiary-50/80 leading-relaxed">
					I'm a software engineer who enjoys turning ideas into thoughtfully crafted, fast,
					and accessible web experiences. I work across the stack and care equally about
					design polish and code quality.
				</p>
				<p class="text-tertiary-50/80 leading-relaxed">
					When I'm not shipping, I'm tinkering with new frameworks, contributing to open
					source, or building small tools to scratch personal itches.
				</p>

				<a
					href="/blog"
					class="bg-tertiary-700/60 hover:bg-tertiary-600 ring-tertiary-300/20 hover:ring-tertiary-300/50 group mt-2 inline-flex w-fit items-center gap-3 rounded-2xl px-5 py-3 font-semibold ring-1 transition-all duration-200"
				>
					<IconNotebook size={20} stroke={1.75} class="text-tertiary-200" />
					<span>Read the blog</span>
					<IconArrowRight
						size={18}
						class="transition-transform duration-200 group-hover:translate-x-1"
					/>
				</a>
			</div>
		</div>

		<div class="mt-20">
			<h3 class="text-tertiary-200 mb-8 text-sm font-bold tracking-widest uppercase">
				Skills &amp; tools
			</h3>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
				{#each skills as { name, icon: Icon }}
					<div
						class="bg-tertiary-700/40 hover:bg-tertiary-700/70 ring-tertiary-300/10 hover:ring-tertiary-300/30 flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-all duration-200"
					>
						<Icon size={26} stroke={1.5} class="text-tertiary-200" />
						<span class="font-semibold">{name}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="mt-20">
			<h3 class="text-tertiary-200 mb-8 text-sm font-bold tracking-widest uppercase">
				Experience
			</h3>
			<div class="flex flex-col gap-5">
				{#each experience as item}
					<div
						class="bg-tertiary-700/40 ring-tertiary-300/10 rounded-2xl p-6 ring-1 transition-all duration-200"
					>
						<div
							class="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center"
						>
							<h4 class="text-xl font-bold">
								{item.role}{#if item.company}<span class="text-tertiary-200 font-medium">
										&middot; {item.company}</span
									>{/if}
							</h4>
							<span class="text-tertiary-300 text-sm font-semibold">{item.period}</span>
						</div>
						<p class="text-tertiary-50/80 mt-3 leading-relaxed">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
