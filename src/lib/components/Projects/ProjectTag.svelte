<script>
	import Tooltip from '$lib/components/Base/Tooltip.svelte';
	let { tag } = $props();

	let tooltipContent = {
		'Svelte 5': {
			description: 'More information about the Svelte 5 technology used in this project.',
			link: 'https://svelte.dev/blog/svelte-5'
		},
		'Tailwind CSS': {
			description:
				'Styled using Tailwind CSS, allowing for rapid UI development with utility-first classes and responsive design.',
			link: 'https://tailwindcss.com/'
		},
		Vite: {
			description:
				'Bundled with Vite, providing fast development server startup and optimized build performance for a smooth development workflow.',
			link: 'https://vitejs.dev/'
		},
		Supabase: {
			description:
				'Utilizes Supabase for backend services, offering real-time database capabilities and authentication out of the box.',
			link: 'https://supabase.com/'
		},
		FastAPI: {
			description:
				'Powered by FastAPI, ensuring high performance and easy scalability for the backend API.',
			link: 'https://fastapi.tiangolo.com/'
		},
		PostgreSQL: {
			description:
				'Data is stored in PostgreSQL, a powerful and reliable relational database system.',
			link: 'https://www.postgresql.org/'
		}
	};
</script>

<Tooltip>
	{#if tooltipContent[tag]?.link}
		<a href={tooltipContent[tag]?.link} target="_blank" rel="noopener noreferrer">
			<span
				class="inline-block rounded bg-primary-900 px-2 py-1 text-xs font-semibold text-primary-50"
			>
				{tag}
			</span>
		</a>
	{:else}
		<span
			class="inline-block cursor-default rounded bg-primary-900 px-2 py-1 text-xs font-semibold text-primary-50"
		>
			{tag}
		</span>
	{/if}

	{#snippet tooltipSnippet()}
		<div class="max-w-[200px] text-center">
			{@html tooltipContent[tag]?.description ||
				`No additional information available for this ${tag}`}
		</div>
	{/snippet}
</Tooltip>
