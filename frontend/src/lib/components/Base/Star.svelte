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
	let alight = false;

	const defaultStyle = (placementStyle) => {
		return `clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40% ); opacity: 0.8; ${placementStyle}; transform: scale(1); transition: 0.4s;`;
	};
	const alightStyle = (placementStyle) => `
					clip-path: polygon(
						50% 0%, 60% 40%, 100% 50%, 60% 60%, 
						50% 100%, 40% 60%, 0% 50%, 40% 40%
					);
					background: white;
					opacity: 1;
					${placementStyle};
 					transform: scale(2);
					box-shadow:
					0 0 10px rgba(255, 255, 255, 0.6),
					0 0 20px rgba(255, 255, 255, 0.4),
					0 0 30px rgba(255, 255, 255, 0.2);
					border-radius: 2px;
					transition: 0.4s;
					`;

	function determineStarPosition(seed) {
		let left = generateRandomNumber(5, windowWidth - 20);
		let top = generateRandomNumber(5, windowHeight - 20);

		return `top:${top}px; left:${left}px;`;
	}

	function startIdleAnimation(placementStyle) {
		idleInterval = setInterval(() => {
			if (!star) {
				clearInterval(idleInterval);
				return;
			}

			alight = !alight;

			requestAnimationFrame(() => {
				if (alight) {
					star.style = alightStyle(placementStyle);

					setTimeout(() => {
						star.style = alightStyle(placementStyle) + 'transform: scale(2) rotate(180deg);';
					}, 420);
				} else {
					star.style = defaultStyle(placementStyle);
					star.classList.remove('star-rotate');
				}
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
				star.style = defaultStyle(placementStyle);
			});

			if (seed % 25 === 0) startIdleAnimation(placementStyle);
		}, 30 * seed);
	});
</script>

<div
	bind:this={star}
	style={rest.style}
	class={twMerge(
		`start-${uuid} absolute left-1/2 top-1/2 z-10 aspect-square w-[3px] rounded-full bg-white opacity-0 transition-all hover:cursor-pointer`,
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
