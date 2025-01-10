<script>
	import { stackingNotificationStore } from './store.svelte.js';
	import Notification from './Notification.svelte';
	import { untrack } from 'svelte';

	let notShown = [];
	let view = $state([]);

	let count = $state(0);
	let addEvents = $state(false);

	let {
		defaultHeight = 80,
		defaultGap = 20,
		show = 3,
		animationDelayBase = 100,
		children
	} = $props();

	let notificationElements = [];

	function exitAnimationLoop() {
		addEvents = true;
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

			if (index < idx) {
				let indexFactor = iteration;

				element.style = `top:${elementTop + 1 * (5 + defaultHeight)}px; transition-delay: ${(indexFactor + 1) * 0.2}s; height: ${defaultHeight}px; `;

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
					notificationElements = document.querySelectorAll('.active-notification');

					let targetElm = notificationElements[0];

					targetElm.style = 'top: -200px';

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

				element.style = `top:${lastElementTop + indexFactor * (5 + defaultHeight)}px; transition-delay: ${(indexFactor + 1) * 0.2}s; height: ${defaultHeight}px; `;

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
			animationDelayBase * 2 * (notificationElements.length - 2)
		);
	}

	function determineTop(idx, notificationElement) {
		//get existing top position for element or set a calculated new one
		if (!notificationElement)
			notificationElements = document.querySelectorAll('.active-notification');

		let targetElm = notificationElement || notificationElements[idx];

		if (notificationElements.length > 0 && targetElm && notificationElement) {
			return parseInt(targetElm.style.top);
		}

		return idx * defaultHeight + (defaultGap + idx * 5);
	}

	let getInitialStyle = (index) =>
		`top: ${determineTop(index)}px; height: ${defaultHeight}px; z-index: ${index}; ${view[index] ? 'opacity:1' : 'opacity:0'} `;

	function handleClickEvent(e) {
		let target = e.target.closest('.active-notification');

		handleNotificationClick(target);
	}

	function attachClickEventIfNotExisting(elm, index) {
		// elm.textContent = index;
		elm.dataset.index = index;

		elm.removeEventListener('click', handleClickEvent);

		elm.addEventListener('click', handleClickEvent);
	}

	function handleNotificationClick(target) {
		let canInteract = target.dataset.interact;
		let index = target.dataset.index;

		if (canInteract === 'false') return;

		addEvents = false;

		count++;

		if (notShown.length == 0) handleRemoveWhenNoNoficationsLeft(index);
		else handleRemoveWhenNoficationsLeft(index);
	}

	$effect(() => {
		addEvents = false;

		// $effect seems to run whenever any states referenced inside it's block scope is modified
		let modifiedNotificationHardCopy = JSON.parse(
			JSON.stringify(stackingNotificationStore.getModifiedNotifications)
		);

		notShown = modifiedNotificationHardCopy.slice(show + 1, modifiedNotificationHardCopy.length);

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
				}, index * 100);
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

			notificationElements.forEach((elm, index) => {
				elm.style = getInitialStyle(index);

				attachClickEventIfNotExisting(elm, index);
				elm.dataset.interact = true;
			});
		}, 200);
	});
</script>

{#if children}
	{@render children()}
{:else}
	{#each stackingNotificationStore.getActiveNotifications as notification, index (notification.uuid)}
		<Notification
			class="flex w-[200px] items-center justify-center rounded-full bg-black px-2 text-white"
		>
			{notification.message}
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
