<!-- big O complextiy estimated O(n) -->

<script>
	import { stackingNotificationStore } from './store.svelte.js';
	import Notification from './Notification.svelte';
	import { untrack } from 'svelte';
	import Button from '../Button/Button.svelte';
	import { IconBell, IconX } from '@tabler/icons-svelte';

	/**
	 * @typedef {Object} Props
	 * @property {int} [defaultHeight] default fixed height for the notifications (needs to be greater than original height)
	 * @property {int} [defaultGap] default gaps between notifications
	 * @property {int} [show] how many should be shown
	 * @property {int} [animationDelayBase] animation delay base (interval between notification transitions)
	 * @property {boolean} [removeNotificationOnClick] does notification close on-click
	 * @property {() => void} [onNotificationClick] onclick event handler
	 */

	/** @type {Props} */
	let {
		defaultGap = 20,
		show = 3,
		animationDelayBase = 100,
		onNotificationClick = () => {},
		removeNotificationOnClick = true,
		children
	} = $props();

	let defaultHeight = 0;

	let notShown = [];
	let view = $state([]);

	let count = $state(0);
	let addEvents = $state(false);

	let totalTopOccupied = $state(0);
	let clearAllButtonTop = $derived(Math.round(totalTopOccupied * 1.1 + defaultGap));

	let notificationElements = [];

	function exitAnimationLoop() {
		addEvents = true;
	}

	function handleRemoveAll() {
		notificationElements = document.querySelectorAll('.active-notification');

		notificationElements.forEach((elm, idx) => {
			elm.style.right = '-200vw';
		});

		setTimeout(() => {
			stackingNotificationStore.updateCurrentActiveNotifications([]);
			exitAnimationLoop();
		}, 150);
	}

	function handleRemoveWhenNoficationsLeft(idx) {
		notificationElements = document.querySelectorAll('.active-notification');

		if (!notificationElements[idx]) return;

		notificationElements[idx].style.right = '-200vw';

		let lastIndexFactor = 0.5;

		//iterate over the previous notifications and set their new position
		for (let index = idx, iteration = 2; index != -1; index--, iteration++) {
			let element = notificationElements[index];
			let elementTop = parseInt(notificationElements[index].style.top);
			defaultHeight = element.getBoundingClientRect().height;

			if (index < idx) {
				let indexFactor = iteration;

				element.style = `top:${elementTop + 1 * (5 + defaultHeight)}px; transition-delay: ${(indexFactor + 1) * 0.2}s; `;

				lastIndexFactor = iteration;
			}
		}

		setTimeout(
			() => {
				stackingNotificationStore.spliceCurrentActiveNotifications(idx, 1);

				stackingNotificationStore.addToCurrentActiveNotificationsFront(notShown[0]);

				notShown = notShown.slice(1, notShown.length);

				view[0] = false;
				view = view;

				setTimeout(() => {
					notificationElements = document.querySelectorAll('.active-notification'); //refresh dom list after manual injection

					let targetElm = notificationElements[0];

					targetElm.style = 'top: -200px';
					defaultHeight = targetElm.getBoundingClientRect().height;

					view[0] = targetElm;
					view = view;

					targetElm.style = `top:${20}px; transition-delay: ${0.2}s; height: ${defaultHeight}px;`;
					targetElm.classList.add('popInAnimation');

					exitAnimationLoop();
				}, 50);
			},
			animationDelayBase * lastIndexFactor * 2.5
		);
	}

	function handleRemoveWhenNoNoficationsLeft(idx) {
		notificationElements = document.querySelectorAll('.active-notification');

		if (!notificationElements[idx]) return;

		let lastElementTop = parseInt(notificationElements[idx].style.top);

		notificationElements[idx].style.right = '-200vw';

		let lastIndexFactor = 0;

		//iterate over the later notifications and set their new position
		notificationElements.forEach((element, index) => {
			if (index > idx) {
				let indexFactor = index - idx - 1;

				defaultHeight = element.getBoundingClientRect().height;

				element.style = `top:${lastElementTop + indexFactor * (5 + defaultHeight)}px; transition-delay: ${(indexFactor + 1) * 0.2}s;  `;

				if (index == notificationElements.length - 1) {
					lastIndexFactor = indexFactor;
				}
			}
		});

		setTimeout(
			() => {
				stackingNotificationStore.spliceCurrentActiveNotifications(idx, 1);

				exitAnimationLoop();
			},
			animationDelayBase * 2 * notificationElements.length
		);
	}

	function determineTop(idx, notificationElement) {
		//get existing top position for element or set a calculated new one

		if (!notificationElement)
			notificationElements = document.querySelectorAll('.active-notification');

		let targetElm = notificationElement || notificationElements[idx];

		defaultHeight = targetElm.getBoundingClientRect().height;

		if (notificationElements.length > 0 && targetElm && notificationElement) {
			return parseInt(targetElm.style.top);
		}

		return idx * defaultHeight + (defaultGap + idx * 5);
	}

	let getInitialStyle = (index) =>
		`top: ${determineTop(index)}px;  z-index: ${index}; ${view[index] ? 'opacity:1' : 'opacity:0'} `;
	// height: ${defaultHeight}px;

	function handleClickEvent(e) {
		let target = e.target.closest('.active-notification');

		onNotificationClick(e);
		handleNotificationClick(target);
	}

	function attachClickEventIfNotExisting(elm, index) {
		elm.dataset.index = index;
		elm.dataset.removeOnClick = removeNotificationOnClick;

		elm.removeEventListener('click', handleClickEvent);

		elm.addEventListener('click', handleClickEvent);
	}

	function handleNotificationClick(target, interact = false, index = -1) {
		let canInteract = target?.dataset.interact || interact;
		index = target?.dataset.index || index;
		let removeOnClick = target?.dataset.removeOnClick;

		if (canInteract === 'false' || removeOnClick === 'false') return;

		addEvents = false;

		count++;

		if (notShown.length == 0) handleRemoveWhenNoNoficationsLeft(index);
		else handleRemoveWhenNoficationsLeft(index);
	}

	$effect(() => {
		addEvents = false;
		totalTopOccupied = 0;

		// $effect seems to run whenever any states referenced inside it's block scope is modified
		let modifiedNotificationHardCopy = JSON.parse(
			JSON.stringify(stackingNotificationStore.getModifiedNotifications)
		);

		notShown = modifiedNotificationHardCopy.slice(show + 1, modifiedNotificationHardCopy.length);

		//untrack makes the compiler ignore the rerun of this effect when stackingNotificationStore.getActiveNotifications(state) changes
		untrack(() =>
			stackingNotificationStore.updateCurrentActiveNotifications(
				modifiedNotificationHardCopy.slice(0, show)
			)
		);

		//wait for svelte to handle dom insertions
		setTimeout(() => {
			notificationElements = document.querySelectorAll('.active-notification');

			notificationElements.forEach((elm, index) => {
				elm.style = getInitialStyle(index);

				setTimeout(() => {
					elm.style.opacity = 1;
					view.push(elm);

					elm.classList.add('popInAnimation');

					determineTop(index, elm); //manually determine position and force calculate top
				}, index * 300);
			});
			addEvents = true;
		}, 10);

		return () => (notificationElements = []); //return cleanup function
	});

	$effect(() => {
		let addEventFlag = addEvents;

		if (!addEventFlag) {
			notificationElements = document.querySelectorAll('.active-notification');

			notificationElements.forEach((elm, index) => {
				elm.dataset.interact = false;
			});

			return;
		}

		setTimeout(() => {
			notificationElements = document.querySelectorAll('.active-notification');
			totalTopOccupied = 0;
			let totalTop = 0;

			console.log(notificationElements.length);

			notificationElements.forEach((elm, index) => {
				elm.style = getInitialStyle(index);

				//calculate clear all button top
				defaultHeight = elm.getBoundingClientRect().height;
				totalTop += defaultHeight;

				attachClickEventIfNotExisting(elm, index);
				elm.dataset.interact = true;
			});

			totalTopOccupied = totalTop;
		}, 200);
	});

	$effect(() => {
		console.log(clearAllButtonTop);
	});
</script>

{#if stackingNotificationStore.getActiveNotifications.length > 0}
	<div style="top: {clearAllButtonTop}px;" class="fixed left-0 right-0 m-auto w-max">
		<Button
			onclick={() => {
				handleRemoveAll();
			}}
			class=" flex w-max items-center justify-center rounded-full bg-slate-200  p-1 text-gray-400 hover:bg-slate-200"
		>
			<IconX size={14} />
		</Button>
	</div>
{/if}
{#if children}
	{@render children()}
{:else}
	{#each stackingNotificationStore.getActiveNotifications as notification, index (notification.uuid)}
		<Notification
			class="flex h-max w-[200px] items-center justify-center rounded-full bg-black px-2 py-4 text-white"
		>
			<div class="m-auto flex max-w-[90%] items-center justify-center gap-4">
				<div class="rounded-full bg-slate-200 p-2 text-black">
					<IconBell size={26} />
				</div>

				<p class=" text-start">
					{notification.message}
				</p>
			</div>
		</Notification>
	{/each}
{/if}

<!-- logic that sets the notification to come from bottom for a new pop in, to be used in handleRemoveWhenNoficationsLeft -->
<!-- if (notShown.length > 0) {
	stackingNotificationStore.getActiveNotifications.push(notShown[0]);
	notShown = notShown.slice(1, notShown.length);

	setTimeout(() => {
		notificationElements = document.querySelectorAll('.active-notification');
		notificationElements[notificationElements.length - 1].classList.add('popInAnimation');
		notificationElements[notificationElements.length - 1].style =
			`top:${lastElementTop + (lastIndexFactor + 1) * (5 + defaultHeight)}px; transition-delay: ${(lastIndexFactor + 1) * 0.2}s; height: ${defaultHeight}px;`;
	}, 20);
} -->
