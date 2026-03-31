<script>
	import ProjectTag from './ProjectTag.svelte';

	let { project } = $props();

	let selectedImage = $state(project?.image);
	let images = $state([]);
	let isLoading = $state(false);

	const slugify = (text) =>
		text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '');

	$effect(() => {
		if (project) {
			selectedImage = project.image;
			images = [];
			loadProjectImages();
		}
	});

	async function loadProjectImages() {
		isLoading = true;
		
		const foundImages = [];
		const extensions = ['png', 'webp', 'jpg', 'jpeg'];
		
		// Always start with the main image from project data
		if (project.image) {
			foundImages.push(project.image);
		}

		for (let i = 1; i <= 5; i++) {
			let foundForIndex = false;
			for (const ext of extensions) {
				const path = `/${project.id}/p_${i}.${ext}`;
				try {
					const res = await fetch(path, { method: 'HEAD' });
					if (res.ok) {
						if (!foundImages.includes(path)) foundImages.push(path);
						foundForIndex = true;
						break;
					}
				} catch (e) {
					// Fetch failed or was blocked
				}
			}

		

			// If p_i wasn't found in any format, we assume the sequence ends
			if (!foundForIndex && i > 1) break;
		}
	console.log(foundImages)
		images = foundImages;
		isLoading = false;
	}
</script>

{#if project}
	<div class="flex h-full flex-col gap-6 overflow-y-auto pr-4">
		<div class="flex h-64 w-full gap-4 md:h-80">
			<div class="relative flex-1 overflow-hidden rounded-xl bg-gray-100 shadow-lg dark:bg-gray-800">
				<img
					src={selectedImage}
					alt={project.name}
					class="h-full w-full object-cover transition-opacity duration-300"
				/>
				{#if isLoading && images.length === 1}
					<div class="absolute inset-0 flex items-center justify-center bg-black/10">
						<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
					</div>
				{/if}
			</div>

			<!-- Thumbnail List (Right) -->
			{#if images.length > 1}
				<div class="flex h-full w-20 flex-col gap-2 overflow-y-auto pr-1 md:w-28">
					{#each images as img}
						<button
							class="group relative aspect-square w-full flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:scale-105 {selectedImage === img ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'}"
							onclick={() => (selectedImage = img)}
						>
							<img
								src={img}
								alt=""
								class="h-full w-full object-cover"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Details Section -->
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
				<div class="flex flex-wrap gap-2">
					{#each project.tags as tag}
						<ProjectTag {tag} />
					{/each}
				</div>
			</div>

			<p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
				{project.longDescription || project.description}
			</p>

			<div class="mt-4 flex gap-4">
				<button
					class="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
				>
					View Live
				</button>
				<button
					class="rounded-full border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					GitHub
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full items-center justify-center text-gray-400">
		<p class="text-xl">Select a project to view details</p>
	</div>
{/if}

<style>
	/* Custom scrollbar for the thumbnail list */
	.overflow-y-auto::-webkit-scrollbar {
		width: 4px;
	}
	.overflow-y-auto::-webkit-scrollbar-track {
		background: transparent;
	}
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}
	.dark .overflow-y-auto::-webkit-scrollbar-thumb {
		background: #475569;
	}
</style>
