<script>
	import { onDestroy, onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { twMerge } from 'tw-merge';

	let array = ['dd', 'bb', 'asd', 'asddd', 'asdddd'];
	let modifiedArray;
	let view = [];

	export let defaultHeight = 80;
	export let defaultGap = 20;

	let notificationElements = [];

	function handleRemove(idx) {
		notificationElements = document.querySelectorAll('.active-notification');
		let lastElementTop = parseInt(notificationElements[idx].style.top);

		notificationElements[idx].style.right = '-1000px';

		notificationElements.forEach((element, index) => {
			if (index > idx) {
				let indexFactor = index - idx - 1;

				element.style = `top:${lastElementTop + indexFactor * (5 + defaultHeight)}px; transition-delay: ${indexFactor * 0.2}s; height: ${defaultHeight}px;`;
			}
		});

		setTimeout(() => {
			modifiedArray.splice(idx, 1);
			modifiedArray = modifiedArray;
		}, 300);
	}

	function determineTop(idx) {
		notificationElements = document.querySelectorAll('.active-notification');
		console.log(notificationElements, modifiedArray, view);
		if (notificationElements.length > 0 && notificationElements[idx]) {
			return parseInt(notificationElements[idx].style.top);
		}

		return idx * defaultHeight + (defaultGap + idx * 5);
	}

	onMount(() => {
		modifiedArray = JSON.parse(JSON.stringify(array));

		setTimeout(() => {
			array.forEach((notification, idx) => {
				view.push(true);
				view = view;
			});
		}, 500);
	});

	onDestroy(() => {});
</script>

{#each modifiedArray as notification, index (notification)}
	{#if view[index]}
		<button
			onclick={() => {
				handleRemove(index);
			}}
			in:scale={{ y: 0, duration: 500, delay: 500 * index + 1 }}
			style={`top: ${determineTop(index, modifiedArray)}px; height: ${defaultHeight}px;`}
			class={twMerge(
				`active-notification fixed left-0 right-0 mx-auto flex w-[200px] items-center justify-center rounded-full bg-black text-white transition-all duration-100 ease-in`,
				$$props.class
			)}
		>
			{notification}
		</button>
	{/if}
{/each}
