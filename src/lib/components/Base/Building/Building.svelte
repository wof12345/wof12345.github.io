<script>
	import { generateRandomNumber } from '$lib/utils/number';
	import { onMount } from 'svelte';

	let { seed } = $props();

	let building;

	function getBuildingStyle() {
		return `height: ${generateRandomNumber(60, 130)}px; width: ${generateRandomNumber(60, 100)}px;`;
	}

	onMount(() => {
		setTimeout(() => {
			requestAnimationFrame(() => {
				if (!building) return;
				building.style = getBuildingStyle();
			});

			// if (isAlight) startIdleAnimation(placementStyle);
		}, 30 * seed);
	});
</script>

<div bind:this={building} class="border border-white"></div>
