<script>
	import projectsData from '$lib/data/projects.json';
	import TimelineScene from '$lib/components/Timeline/TimelineScene.svelte';

	/** @param {typeof projectsData} items */
	function groupByPeriod(items) {
		const byPeriod = new Map();

		for (const project of items) {
			const key = project.period ?? 'Other';
			if (!byPeriod.has(key)) {
				byPeriod.set(key, {
					period: key,
					context: project.context,
					projects: []
				});
			}
			byPeriod.get(key).projects.push(project);
		}

		return Array.from(byPeriod.values()).sort((a, b) => {
			const aNum = Number(a.period);
			const bNum = Number(b.period);
			if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
				return String(b.period).localeCompare(String(a.period));
			}
			return bNum - aNum;
		});
	}

	const groups = groupByPeriod(projectsData);
</script>

<section id="projects" class="bg-secondary-800 relative w-full text-white">
	<div class="px-6 py-16 md:py-20">
		<div class="mx-auto flex max-w-6xl flex-col items-center text-center">
			<p class="text-secondary-300 text-sm font-semibold tracking-widest uppercase">
				What I've built
			</p>
			<h2 class="mt-2 text-4xl font-bold md:text-5xl">Projects</h2>
			<div class="bg-secondary-300 mt-4 h-1 w-16 rounded-full"></div>
			<p class="text-secondary-100/70 mt-6 max-w-xl">
				A timeline grouped by year. The year stays pinned while every project from that year scrolls
				past — your reference frame for the timeline.
			</p>
		</div>
	</div>

	{#each groups as group, i}
		<TimelineScene {group} index={i} total={groups.length} />
	{/each}
</section>
