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
		IconNotebook,
		IconUser
	} from '@tabler/icons-svelte';
	import Reveal from '$lib/components/Animated/Entity/Reveal.svelte';
	import CompanyTag from '$lib/components/Projects/CompanyTag.svelte';
	import { companies } from '$lib/data/companies';

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
			company: 'Nanokingfisher',
			period: 'Oct 2025 — Present',
			description:
				'Building full-stack features across the product as a software engineer — shipping reliable, maintainable code as the team grows.'
		},
		{
			role: 'Co-founder',
			company: 'Brownbrick',
			period: '2024',
			description:
				'Co-founded the company and built Taajir, a full inventory-management and point-of-sale platform for small and medium-sized businesses.'
		},
		{
			role: 'Software Engineer (Intern → Full-Time)',
			company: 'Liberate Labs',
			period: 'Aug 2023 — Feb 2024',
			description:
				'Started as an intern and grew into a full-time software engineer, contributing to production web apps across the frontend and backend.'
		},
		{
			role: 'Software Engineer',
			company: 'Freelance',
			period: '2023 — Present',
			description:
				'Designing and shipping full-stack web applications with a focus on clean UI, accessibility, and performance — from Svelte/React frontends to FastAPI and PostgreSQL backends.'
		},
		{
			role: 'Independent Developer',
			company: '',
			period: '2020 — 2023',
			description:
				'Self-taught my way through modern web development — front-end frameworks, server-side APIs, databases, and deployment — by building real projects end to end.'
		}
	];

	// Tail direction + on-stage position for each bubble, by index.
	const bubbleLayout = ['pos-0 tail-down', 'pos-1 tail-right', 'pos-2 tail-up'];
</script>

<section id="about" class="bg-tertiary-800 w-full py-24 text-white md:py-32">
	<div class="mx-auto max-w-5xl px-6">
		<Reveal class="mb-16 flex flex-col items-center text-center">
			<p class="text-tertiary-300 text-sm font-semibold tracking-widest uppercase">
				Who I am
			</p>
			<h2 class="mt-2 text-4xl font-bold md:text-5xl">About me</h2>
			<div class="bg-tertiary-300 mt-4 h-1 w-16 rounded-full"></div>
		</Reveal>

		<div class="grid gap-10 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
			<Reveal class="flex justify-center md:justify-start" x={-24} y={0}>
				<div class="comic-stage relative flex flex-col items-center gap-5 md:block">
					<div
						class="ring-tertiary-300/30 aspect-square w-44 overflow-hidden rounded-3xl shadow-2xl ring-4 md:w-56"
					>
						<img src="/dev/pp.png" alt="Atif" class="h-full w-full object-cover" />
					</div>

					<div class="comic-bubbles flex flex-wrap justify-center gap-2.5 md:contents">
						{#each companies as company, i}
							<a
								href="/company/{company.id}"
								class="comic-bubble {bubbleLayout[i % bubbleLayout.length]}"
								style="--rot: {i % 2 === 0 ? 5 : -6}deg; animation-delay: {500 + i * 180}ms;"
								aria-label="{company.role} at {company.name}"
							>
								<span class="comic-bubble__inner" style="animation-delay: {i * 700}ms;">
									<span class="comic-bubble__name" style="color: {company.color};"
										>{company.name}</span
									>
									<span class="comic-bubble__role">{company.tagline}</span>
								</span>
							</a>
						{/each}
					</div>
				</div>
			</Reveal>

			<Reveal class="flex flex-col gap-4" x={24} y={0} delay={120}>
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

				<div class="mt-2 flex flex-wrap gap-3">
					<a
						href="/blog"
						class="bg-tertiary-700/60 hover:bg-tertiary-600 ring-tertiary-300/20 hover:ring-tertiary-300/50 group inline-flex w-fit items-center gap-3 rounded-2xl px-5 py-3 font-semibold ring-1 transition-all duration-200"
					>
						<IconNotebook size={20} stroke={1.75} class="text-tertiary-200" />
						<span>Read the blog</span>
						<IconArrowRight
							size={18}
							class="transition-transform duration-200 group-hover:translate-x-1"
						/>
					</a>

					<a
						href="/about"
						class="bg-tertiary-700/60 hover:bg-tertiary-600 ring-tertiary-300/20 hover:ring-tertiary-300/50 group inline-flex w-fit items-center gap-3 rounded-2xl px-5 py-3 font-semibold ring-1 transition-all duration-200"
					>
						<IconUser size={20} stroke={1.75} class="text-tertiary-200" />
						<span>More about me</span>
						<IconArrowRight
							size={18}
							class="transition-transform duration-200 group-hover:translate-x-1"
						/>
					</a>
				</div>
			</Reveal>
		</div>

		<div class="mt-20">
			<Reveal>
				<h3 class="text-tertiary-200 mb-8 text-sm font-bold tracking-widest uppercase">
					Skills &amp; tools
				</h3>
			</Reveal>
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
				{#each skills as { name, icon: Icon }, i}
					<Reveal delay={i * 60} y={16}>
						<div
							class="bg-tertiary-700/40 hover:bg-tertiary-700/70 ring-tertiary-300/10 hover:ring-tertiary-300/30 flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-all duration-200"
						>
							<Icon size={26} stroke={1.5} class="text-tertiary-200" />
							<span class="font-semibold">{name}</span>
						</div>
					</Reveal>
				{/each}
			</div>
		</div>

		<div class="mt-20">
			<Reveal>
				<h3 class="text-tertiary-200 mb-8 text-sm font-bold tracking-widest uppercase">
					Experience
				</h3>
			</Reveal>
			<div class="flex flex-col gap-5">
				{#each experience as item, i}
					<Reveal delay={i * 90} y={28}>
						<div
							class="bg-tertiary-700/40 ring-tertiary-300/10 hover:bg-tertiary-700/60 hover:ring-tertiary-300/30 rounded-2xl p-6 ring-1 transition-all duration-200"
						>
							<div
								class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
							>
								<div class="flex flex-wrap items-center gap-3">
									<h4 class="text-xl font-bold">{item.role}</h4>
									{#if item.company}
										<CompanyTag company={item.company} />
									{/if}
								</div>
								<span class="text-tertiary-300 text-sm font-semibold">{item.period}</span>
							</div>
							<p class="text-tertiary-50/80 mt-3 leading-relaxed">{item.description}</p>
						</div>
					</Reveal>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* --- Comic-book speech bubbles around the avatar --- */
	/* Mobile: bubbles flow as a wrapped row beneath the avatar. */
	.comic-bubble {
		position: relative;
		z-index: 30;
		text-decoration: none;
		opacity: 0;
		animation: comic-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	.comic-bubble__inner {
		position: relative;
		display: flex;
		flex-direction: column;
		line-height: 1.1;
		background: #fff;
		color: #111;
		border: 3px solid #111;
		border-radius: 0.9rem;
		padding: 0.4rem 0.7rem;
		box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.85);
		animation: comic-float 4.5s ease-in-out infinite;
		transition: transform 0.2s ease;
	}

	.comic-bubble__name {
		font-weight: 800;
		font-size: 0.72rem;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.comic-bubble__role {
		font-weight: 700;
		font-size: 0.55rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #6b7280;
		white-space: nowrap;
	}

	.comic-bubble:hover {
		z-index: 40;
	}

	.comic-bubble:hover .comic-bubble__inner {
		animation-play-state: paused;
		transform: scale(1.08) translateY(-2px) rotate(-1deg);
	}

	/* Desktop: bubbles float, positioned around the avatar stage. */
	@media (min-width: 768px) {
		.comic-bubble {
			position: absolute;
		}
		.pos-0 {
			top: -1.25rem;
			right: -3rem;
		}
		.pos-1 {
			top: 38%;
			left: -3.5rem;
		}
		.pos-2 {
			bottom: -1.25rem;
			left: -2.5rem;
		}
		.comic-bubble__name {
			font-size: 0.8rem;
		}
		.comic-bubble__role {
			font-size: 0.6rem;
		}
	}

	/* Speech-bubble tails (outlined: black underlay + white overlay).
	   Only shown on desktop, where bubbles point at the avatar. */
	.comic-bubble__inner::before,
	.comic-bubble__inner::after {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		display: none;
	}

	@media (min-width: 768px) {
		.comic-bubble__inner::before,
		.comic-bubble__inner::after {
			display: block;
		}
	}

	.tail-down .comic-bubble__inner::before {
		bottom: -13px;
		left: 22px;
		border: 7px solid transparent;
		border-top-color: #111;
		border-bottom: 0;
	}
	.tail-down .comic-bubble__inner::after {
		bottom: -8px;
		left: 24px;
		border: 5px solid transparent;
		border-top-color: #fff;
		border-bottom: 0;
	}

	.tail-up .comic-bubble__inner::before {
		top: -13px;
		right: 22px;
		border: 7px solid transparent;
		border-bottom-color: #111;
		border-top: 0;
	}
	.tail-up .comic-bubble__inner::after {
		top: -8px;
		right: 24px;
		border: 5px solid transparent;
		border-bottom-color: #fff;
		border-top: 0;
	}

	.tail-right .comic-bubble__inner::before {
		right: -13px;
		top: 50%;
		transform: translateY(-50%);
		border: 7px solid transparent;
		border-left-color: #111;
		border-right: 0;
	}
	.tail-right .comic-bubble__inner::after {
		right: -8px;
		top: 50%;
		transform: translateY(-50%);
		border: 5px solid transparent;
		border-left-color: #fff;
		border-right: 0;
	}

	@keyframes comic-pop {
		0% {
			opacity: 0;
			transform: scale(0.2) rotate(var(--rot, 0deg));
		}
		60% {
			opacity: 1;
			transform: scale(1.12) rotate(var(--rot, 0deg));
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(var(--rot, 0deg));
		}
	}

	@keyframes comic-float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-6px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.comic-bubble {
			animation: none;
			opacity: 1;
		}
		.comic-bubble__inner {
			animation: none;
		}
	}
</style>
