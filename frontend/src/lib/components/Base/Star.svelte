<script>
	import { generateRandomNumber } from '$lib/utils/number.js';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { v4 as uuidv4 } from 'uuid';

	let { children, seed, ...rest } = $props();

	let windowWidth = $state(0);
	let windowHeight = $state(0);

	let idleInterval = $state();

	const uuid = uuidv4();
	let star;

	function determineStarPosition() {
		let left = generateRandomNumber(5, windowWidth - 20);
		let top = generateRandomNumber(5, windowHeight - 20);

		return `top:${top}px; left:${left}px;`;
	}

	function startIdleAnimation(placementStyle) {
		idleInterval = setInterval(() => {
			const param1 = generateRandomNumber(30, 50);
			const param2 = generateRandomNumber(30, 50);
			const param3 = generateRandomNumber(30, 50);
			const param4 = generateRandomNumber(50, 100);

			requestAnimationFrame(() => {
				star.style = `clip-path: polygon(${param1}% ${param2}%, 48% 1%, 58% 46%, 96% 52%, 59% 58%, ${param3}% ${param4}%, 47% 57%, 0% 30%); opacity: 1;  ${placementStyle}; transform: scale(2);`;
			});
		}, 1000);
	}

	onMount(() => {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;

		const placementStyle = determineStarPosition(seed);

		setTimeout(() => {
			if (!star) return;
			requestAnimationFrame(() => {
				star.style = `clip-path: polygon(47% 47%, 48% 1%, 58% 46%, 96% 52%, 59% 58%, 51% 100%, 47% 57%, 0% 30%); opacity: 1; ${placementStyle}`;
			});

			if (seed % 25 === 0) startIdleAnimation(placementStyle);
		}, 30 * seed);
	});
</script>

<div
	bind:this={star}
	style={rest.style}
	class={twMerge(
		`start-${uuid} absolute left-10 top-2 aspect-square w-[3px] rounded-full bg-white opacity-0 transition-all hover:cursor-pointer`,
		rest.class
	)}
>
	<!-- <div
		class="absolute bottom-0 left-0 right-0 top-0 m-auto h-[10px] w-[0.5px] rotate-45 bg-white"
	></div>
	<div
		class="absolute bottom-0 left-0 right-0 top-0 m-auto h-[7px] w-[0.5px] rotate-90 bg-white"
	></div> -->
</div>
