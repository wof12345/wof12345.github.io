<script>
	/** @type {{ company?: string }} */
	let { company } = $props();

	/** @type {Record<string, { bg: string; text: string; ring: string; link: string | null }>} */
	const styles = {
		Brownbrick: {
			bg: 'bg-[#BB9457]',
			text: 'text-[#99582A]',
			ring: 'ring-[#BB9457]/30',
			link: 'https://brownbrick.io'
		},
		Freelance: {
			bg: 'bg-emerald-500/15',
			text: 'text-emerald-200',
			ring: 'ring-emerald-400/30',
			link: null
		},
		Personal: {
			bg: 'bg-sky-500/15',
			text: 'text-sky-200',
			ring: 'ring-sky-400/30',
			link: null
		},
		'Self-employed': {
			bg: 'bg-teal-500/15',
			text: 'text-teal-200',
			ring: 'ring-teal-400/30',
			link: null
		},
		'Open source': {
			bg: 'bg-purple-500/15',
			text: 'text-purple-200',
			ring: 'ring-purple-400/30',
			link: 'https://github.com/wof12345'
		},
		'Side project': {
			bg: 'bg-rose-500/15',
			text: 'text-rose-200',
			ring: 'ring-rose-400/30',
			link: null
		}
	};

	const fallback = {
		bg: 'bg-white/10',
		text: 'text-white/80',
		ring: 'ring-white/15',
		link: null
	};

	let style = $derived(company ? (styles[company] ?? fallback) : fallback);

	const baseClass =
		'inline-flex w-fit items-center font-bold rounded-md px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase ring-1 md:text-xs';
</script>

{#if company}
	{#if style.link}
		<a
			href={style.link}
			target="_blank"
			rel="noopener noreferrer"
			onclick={(e) => e.stopPropagation()}
			class="{baseClass} {style.bg} {style.text} {style.ring} transition hover:brightness-110"
		>
			{company}
		</a>
	{:else}
		<span class="{baseClass} {style.bg} {style.text} {style.ring}">
			{company}
		</span>
	{/if}
{/if}
