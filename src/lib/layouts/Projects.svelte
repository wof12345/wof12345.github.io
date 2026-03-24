<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import ProjectList from '$lib/components/Projects/ProjectList.svelte';
	import ProjectDetail from '$lib/components/Projects/ProjectDetail.svelte';
	import projects from '$lib/data/projects.json';
	import { routeState } from '$lib/stores/navigation.svelte';
	import { onMount } from 'svelte';

	let bubble = $state(undefined);
	const routeIndex = 1;
	let route = $state(routeState.getRoutes()[routeIndex]);

	// Get selected project from query param
	let selectedProjectId = $derived(page.url.searchParams.get('project'));
	let selectedProject = $derived(projects.find((p) => p.id === selectedProjectId));

	// If project not found but ID exists, or no ID and desktop, we might want default
	// On mobile, if no project ID, we show the list.

	function selectProject(project) {
		const url = new URL(page.url);
		url.searchParams.set('project', project.id);
		goto(url, { replaceState: true, noScroll: true });
	}

	function goBack() {
		const url = new URL(page.url);
		url.searchParams.delete('project');
		goto(url, { replaceState: true, noScroll: true });
	}

	$effect(() => {
		route = routeState.getRoutes()[routeIndex];
		let active = route.active;

		if (!active) {
			bubble.shrink();
		}
	});

	onMount(() => {
		routeState.setBubble(bubble, routeIndex);
	});
</script>

<Bubble
	bind:this={bubble}
	class="{route.initialClass} bg-{route.primaryColor}-800 m-0"
	coverClass="hover:cursor-pointer bg-{route.primaryColor}-800"
	onclick={() => {
		routeState.set(routeIndex);
	}}
	onExpand={() => {}}
	initDelayFactor={(routeState.getRoutes().length - routeIndex) * 0.3}
	initDelay={2500}
	{route}
>
	{#snippet coverChildren()}
		{@const CoverIcon = route.icon}
		<div class="text-lg font-bold text-white">
			<CoverIcon />
		</div>
	{/snippet}

	<div class="flex h-full items-center justify-center text-white">
		<div class="flex h-full w-full gap-4 p-4 pl-12 md:gap-8 md:p-8 md:pl-24">
			<!-- Mobile: Only show Details if project is selected -->
			<!-- Desktop: Always show Details (with a default if none selected) -->

			<div
				class="h-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-xl md:p-6 dark:bg-gray-900
				{selectedProject ? 'flex w-full md:w-[65%]' : 'hidden md:flex md:w-[65%]'}"
			>
				{#if selectedProject}
					<button
						class="mb-4 flex items-center gap-2 font-semibold text-blue-600 md:hidden"
						onclick={goBack}
					>
						← Back to Projects
					</button>
					<ProjectDetail project={selectedProject} />
				{:else}
					<div class="hidden h-full items-center justify-center text-gray-400 md:flex">
						<p class="text-xl">Select a project to view details</p>
					</div>
				{/if}
			</div>

			<!-- Mobile: Only show List if NO project is selected -->
			<!-- Desktop: Always show List -->
			<div
				class="h-full flex-col gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-xl dark:bg-gray-900
				{selectedProject ? 'hidden md:flex md:w-[35%]' : 'flex w-full md:w-[35%]'}"
			>
				<ProjectList {projects} onSelect={selectProject} />
			</div>
		</div>
	</div>
</Bubble>

<style>
	::-webkit-scrollbar {
		width: 6px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}
	.dark ::-webkit-scrollbar-thumb {
		background: #4b5563;
	}
</style>
