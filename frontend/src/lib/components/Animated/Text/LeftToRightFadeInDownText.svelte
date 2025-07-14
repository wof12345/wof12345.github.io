<script>
	import { tabVisibleState } from '$lib/stores/dom.svelte';
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { v4 as uuidv4 } from 'uuid';

	let { children, entryDelay = 200, intervalDelay = 100, byWord = false, ...rest } = $props();

	let animtedTextId = uuidv4();

	let animatedContainer;
	let animatedParts = $state();

	let entryInit = $state(false);
	let entryComplete = $state(false);

	let exitInit = $state(false);
	let exitComplete = $state(false);

	let entrySequenceInterval = $state();
	let exitSequenceInterval = $state();

	let animated = $state(false);

	const initialStyle = 'transition: 1s; opacity: 0; transform: translateY(-10px)';

	function fragmentStringToElement(string) {
		let reconstructedHtml = '';

		string.split(byWord ? ' ' : '').forEach((character, idx) => {
			if (!byWord) {
				if (character.trim() !== '')
					reconstructedHtml += `<span class='inline-block animated-character' style='${initialStyle}'>${character}</span>`;
				else reconstructedHtml += `<span class='inline-block'>&nbsp;</span>`;
			} else {
				reconstructedHtml += `<span class='inline-block animated-character' style='${initialStyle}'>${character}&nbsp;</span>`;
			}
		});

		return reconstructedHtml;
	}

	function triggerExitSequence() {
		entryComplete = false;

		if (entryInit) {
			clearInterval(entrySequenceInterval);
			entryInit = false;
		}

		let iterator = animatedParts.length - 1;

		requestAnimationFrame(() => {
			animatedContainer.style.opacity = 1;

			exitSequenceInterval = setInterval(() => {
				if (iterator < 0 || !animatedParts[iterator]) {
					clearInterval(exitSequenceInterval);
					exitComplete = true;
					return;
				}

				exitInit = true;

				animatedParts[iterator].style = initialStyle;

				iterator--;
			}, intervalDelay);
		});
	}

	function triggerEntrySequence() {
		exitComplete = false;

		if (exitInit) {
			clearInterval(exitSequenceInterval);
			exitInit = false;
		}

		let iterator = 0;

		requestAnimationFrame(() => {
			if (!animatedContainer) {
				clearInterval(exitSequenceInterval);
				return;
			}

			animatedContainer.style.opacity = 1;

			entrySequenceInterval = setInterval(
				() => {
					if (iterator >= animatedParts.length || !animatedParts[iterator]) {
						clearInterval(entrySequenceInterval);
						entryComplete = true;
						animated = true;
						return;
					}

					entryInit = true;

					// let rand = Math.floor(Math.random() * animatedParts.length);

					animatedParts[iterator].style = 'transition: 1s; opacity: 1; transform: translateY(0);';

					iterator++;
				},
				byWord ? intervalDelay * 3 : intervalDelay
			);
		});
	}

	$effect(() => {
		const tabVisible = tabVisibleState.get();
		if (animated || !tabVisible) return;

		const text = animatedContainer.textContent;

		const fragmentedHtml = fragmentStringToElement(text);

		animatedContainer.innerHTML = fragmentedHtml;

		animatedParts = document.querySelectorAll(
			`.animated-text-${animtedTextId} .animated-character`
		);

		setTimeout(() => {
			triggerEntrySequence();
		}, entryDelay);
	});
</script>

<button
	onclick={() => {
		if (entryComplete) triggerExitSequence();
		else if (exitComplete) triggerEntrySequence();
	}}
	bind:this={animatedContainer}
	class={twMerge(
		`animated-text-${animtedTextId} w-max max-w-full tracking-tight opacity-0`,
		rest.class
	)}
>
	{@render children()}
</button>

<style>
	.test {
		margin-top: 10px;
	}
</style>
