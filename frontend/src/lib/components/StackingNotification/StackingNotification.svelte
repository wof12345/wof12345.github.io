<script>
	import { onDestroy, onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { twMerge } from 'tw-merge';
	import { v4 as uuidv4 } from 'uuid';

	let array = ['dd', 'bb', 'asd', 'asddd', 'asdddd', 'dsafas', 'sfa', 'fasd'];
	let modifiedArray;
	let notShown = [];
	let view = [];

	export let defaultHeight = 80;
	export let defaultGap = 20;
	export let show = 5;

	let notificationElements = [];

	function handleRemoveWhenNoficationsLeft(idx) {
		notificationElements = document.querySelectorAll('.active-notification');

		notificationElements[idx].style.right = '-200vw';

		let lastIndexFactor = 0;

		//iterates over the previous notifications and sets their new position
		for (let index = idx, iteration = 1; index != -1; index--, iteration++) {
			let element = notificationElements[index];
			let elementTop = parseInt(notificationElements[index].style.top);

			if (index < idx) {
				let indexFactor = iteration;

				element.style = `top:${elementTop + 1 * (5 + defaultHeight)}px; transition-delay: ${(indexFactor + 1) * 0.2}s; height: ${defaultHeight}px;  `;
			}
		}

		setTimeout(
			() => {
				modifiedArray.splice(idx, 1);

				modifiedArray.unshift(notShown[0]);

				notShown = notShown.slice(1, notShown.length);

				view[0] = false;
				view = view;

				modifiedArray = modifiedArray;

				setTimeout(() => {
					notificationElements = document.querySelectorAll('.active-notification');

					notificationElements[0].style = 'top: -200px';

					view[0] = notificationElements[0];
					view = view;

					notificationElements[0].classList.add('popInAnimation');
					notificationElements[0].style = `top:${20}px; transition-delay: ${lastIndexFactor + 1 * 0.2}s; height: ${defaultHeight}px;`;
				}, 50);
			},
			200 * notificationElements.length - 2
		);
	}

	function handleRemoveWhenNoNoficationsLeft(idx) {
		notificationElements = document.querySelectorAll('.active-notification');
		let lastElementTop = parseInt(notificationElements[idx].style.top);

		notificationElements[idx].style.right = '-200vw';

		let lastIndexFactor = 0;
		notificationElements.forEach((element, index) => {
			if (index > idx) {
				let indexFactor = index - idx - 1;

				element.style = `top:${lastElementTop + indexFactor * (5 + defaultHeight)}px; transition-delay: ${(indexFactor + 1) * 0.2}s; height: ${defaultHeight}px;`;

				if (index == notificationElements.length - 1) {
					lastIndexFactor = indexFactor;
				}
			}
		});

		setTimeout(
			() => {
				modifiedArray.splice(idx, 1);

				if (notShown.length > 0) {
					modifiedArray.push(notShown[0]);
					notShown = notShown.slice(1, notShown.length);

					modifiedArray = modifiedArray;

					console.log(lastIndexFactor);

					setTimeout(() => {
						notificationElements = document.querySelectorAll('.active-notification');
						notificationElements[notificationElements.length - 1].classList.add('popInAnimation');
						notificationElements[notificationElements.length - 1].style =
							`top:${lastElementTop + (lastIndexFactor + 1) * (5 + defaultHeight)}px; transition-delay: ${(lastIndexFactor + 1) * 0.2}s; height: ${defaultHeight}px;`;
					}, 20);
				} else {
					modifiedArray = modifiedArray;
				}
			},
			200 * notificationElements.length - 2
		);
	}

	function determineTop(idx) {
		notificationElements = document.querySelectorAll('.active-notification');

		if (notificationElements.length > 0 && notificationElements[idx]) {
			return parseInt(notificationElements[idx].style.top);
		}

		return idx * defaultHeight + (defaultGap + idx * 5);
	}

	function initiate() {
		modifiedArray = JSON.parse(JSON.stringify(array));

		notShown = modifiedArray.slice(show + 1, modifiedArray.length);

		modifiedArray = modifiedArray.slice(0, show);

		setTimeout(() => {
			notificationElements = document.querySelectorAll('.active-notification');

			notificationElements.forEach((elm, index) => {
				setTimeout(() => {
					elm.style.opacity = 1;
					view.push(elm);
					elm.classList.add('popInAnimation');
				}, index * 100);
			});
		}, 50);
	}

	onMount(() => {
		initiate();
	});

	onDestroy(() => {});
</script>

{#each modifiedArray as notification, index (notification)}
	<button
		onclick={() => {
			if (notShown.length == 0) handleRemoveWhenNoNoficationsLeft(index);
			else handleRemoveWhenNoficationsLeft(index);
		}}
		style={`top: ${determineTop(index, modifiedArray)}px; height: ${defaultHeight}px; z-index: ${index}; ${view[index] ? 'opacity:1' : 'opacity:0'} `}
		class="{twMerge(
			`active-notification fixed left-0 right-0 mx-auto flex w-[200px] items-center justify-center rounded-full bg-black text-white transition-all duration-200 ease-in-out`,
			$$props.class
		)}}"
	>
		{notification}
	</button>{/each}

<style>
	.popInAnimation {
		animation: appear 0.3s ease-in-out;
		z-index: 5;
	}
	@keyframes appear {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
