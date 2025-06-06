<script>
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Star from '$lib/components/Base/Star.svelte';
	import { generateRandomNumber } from '$lib/utils/number.js';
	import Planet from '$lib/components/Base/Planet.svelte';
	import { onMount } from 'svelte';
	import { scrollToSection } from '$lib/utils/dom/scroll';
	import { scrollState } from '$lib/stores/dom.svelte';
	import MoveOnScroll from '$lib/components/Animated/Entity/MoveOnScroll.svelte';

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

	const handleScroll = async (e, direction) => {
		const currentScrollY = window.scrollY;

		scrollState.set(currentScrollY);

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

		console.log('dd', e, scrolling);

		e?.preventDefault();

		if (scrolling || e) return;

		await scrollToNextOrPreviousSection(scrollDirection);
	};

	function populateSectionCollection() {
		const sections = document.querySelectorAll(`.site-section`);

		sections.forEach((section) => {
			sectionCollection.push({
				htmlRef: section,
				id: section.id
			});
		});

		detectActiveSection();
	}

	function detectActiveSection() {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const sectionIndex = sectionCollection.findIndex(
							(sectionItem) => sectionItem.id === entry.target.id
						);
						currentSectionIndex = sectionIndex;
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
		e.preventDefault();

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

<section id="home-space" class="site-section relative h-screen bg-black" style="perspective: 2px;">
	<MoveOnScroll>
		<div class="relative z-30 flex flex-col items-center justify-center pt-24">
			<div
				class="flex aspect-square w-52 items-center justify-center rounded-full bg-gray-50 bg-opacity-5 p-4"
			>
				<div class="h-full w-full overflow-hidden rounded-full">
					<img src="/dev/dev.jpg" alt="" class="object-cover object-center" />
				</div>
			</div>

			<div class="flex flex-col">
				<LeftToRightFadeInDown class="w-full text-center text-2xl font-bold text-white"
					>The only limit to your imagination is the one you set yourself.
				</LeftToRightFadeInDown>

				<LeftToRightFadeInDown
					class="w-full text-end text-sm font-bold text-white"
					entryDelay={6000}
					>— Roy T. Bennett
				</LeftToRightFadeInDown>
			</div>
		</div>
	</MoveOnScroll>

	{#each Object.keys(planets) as planet, idx (idx)}
		<Planet
			randomizePos={false}
			class={`${getPlanetPosition(planet)}`}
			planet={planets[planet]}
			name={planet}
			seed={idx + 1}
		/>
	{/each}

	<!-- {#each Array(generateRandomNumber(300, 350)) as star, idx (idx)}
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
