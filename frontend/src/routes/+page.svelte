<script>
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Star from '$lib/components/Base/Star.svelte';
	import { generateRandomNumber } from '$lib/utils/number.js';
	import Planet from '$lib/components/Base/Planet.svelte';
	import { onMount } from 'svelte';
	import { scrollToSection } from '$lib/utils/dom/scroll';

	let planets = {
		mercury: { class: `top-[35%] left-[65%] scale-[50%] z-[21]` },
		venus: { class: `top-[5%] left-[50%] scale-[100%]` },
		earth: { class: `top-[54%] left-[74%] scale-[100%] z-[22]` },
		mars: { class: `top-[50%] left-[20%] scale-[90%]` },
		jupiter: { class: `top-[86%] left-[24%] scale-[150%]` },
		saturn: { class: `top-[80%] left-[60%] scale-[90%]` },
		uranus: { class: `top-[20%] left-[10%] scale-[110%]` },
		neptune: { class: `top-[10%] left-[90%] scale-[110%]` },
		sun: { class: `top-[60%] left-[50%] scale-[300%]` }
	};

	let sectionCollection = $state([]);
	let currentSectionIndex = $state(0);

	let scrolling = $state(false);

	function getPlanetPosition(planet) {
		let posClass = planets[planet].class;

		return posClass;
	}

	let lastScrollY = 0;
	let scrollDirection = 'down';

	const scrollToNextOrPreviousSection = async (scrollDirection) => {
		let newIndex = currentSectionIndex;

		if (scrollDirection === 'down') {
			newIndex += 2;
		} else {
			newIndex -= 2;
		}

		let nextSectionId = sectionCollection[newIndex]?.id;

		if (nextSectionId) {
			scrolling = true;
			scrolling = await scrollToSection(nextSectionId);
		}
	};

	const handleScroll = (e, direction) => {
		const currentScrollY = window.scrollY;

		if (direction) {
			scrollDirection = direction;
		} else {
			if (currentScrollY > lastScrollY) {
				scrollDirection = 'down';
			} else if (currentScrollY < lastScrollY) {
				scrollDirection = 'up';
			}
		}
		lastScrollY = currentScrollY;
		// console.log('Scroll Y:', currentScrollY);
		// console.log('Direction:', scrollDirection);

		e?.preventDefault();

		if (scrolling) return;

		scrollToNextOrPreviousSection(scrollDirection);
	};

	function populateSectionCollection() {
		const sections = document.querySelectorAll(`.site-section`);

		sections.forEach((section) => {
			sectionCollection.push({
				htmlRef: section,
				id: section.id
			});
		});

		console.log(sectionCollection);

		detectActiveSection();
	}

	function detectActiveSection() {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						console.log(entry.target.id);
						const sectionIndex = sectionCollection.findIndex(
							(sectionItem) => sectionItem.id === entry.target.id
						);
						currentSectionIndex = sectionIndex;
						console.log('Currently in section:', currentSectionIndex);
					}
				}
			},
			{
				threshold: 0.5
			}
		);

		const sectionIds = sectionCollection.map((sectionItem) => sectionItem.id);

		for (const id of sectionIds) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}
	}

	async function handleWheel(e) {
		if (currentSectionIndex !== sectionCollection.length - 1) e.preventDefault();

		const direction = e.deltaY > 0 ? 'down' : 'up';

		handleScroll(undefined, direction);
	}

	onMount(() => {
		populateSectionCollection();

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('wheel', handleWheel);
		};
	});
</script>

<section id="home-space" class="site-section relative h-screen bg-black">
	<div class="flex flex-col items-center justify-center pt-24">
		<div class="flex aspect-square w-52 items-center justify-center rounded-full bg-blue-200 p-4">
			<div class="h-full w-full rounded-full bg-red-300"></div>
		</div>

		<LeftToRightFadeInDown class="w-full text-center text-6xl font-bold text-white"
			>Welcome to your abode!
		</LeftToRightFadeInDown>
	</div>

	{#each Object.keys(planets) as planet, idx (idx)}
		<Planet randomizePos={false} class={`${getPlanetPosition(planet)}`} {planet} seed={idx} />
	{/each}

	<!-- {#each Array(generateRandomNumber(300, 500)) as star, idx (idx)}
		<Star seed={idx} />
	{/each} -->
</section>

<section id="home-space_to_home-earth-clouds" class="site-section h-[1000px] w-full"></section>

<section id="earth-sea-level" class="site-section h-[1000px] w-full bg-black"></section>

<section
	id="earth-sea-level_to_ground-level"
	class="site-section h-[1000px] w-full bg-white"
></section>

<section id="ground-level" class="site-section h-[1000px] w-full bg-black"></section>
