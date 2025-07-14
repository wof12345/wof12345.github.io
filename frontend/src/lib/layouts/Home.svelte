<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import DropInFromBottom from '$lib/components/Animated/Entity/DropInFromBottom.svelte';
	import FadeIn from '$lib/components/Animated/Entity/FadeIn.svelte';

	import LeftToRightFadeInDownText from '$lib/components/Animated/Text/LeftToRightFadeInDownText.svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import { routeState } from '$lib/stores/navigation.svelte';
	import {
		IconBrandDiscord,
		IconBrandFacebook,
		IconBrandGithub,
		IconBrandLinkedin,
		IconBrandX
	} from '@tabler/icons-svelte';
	import { onMount } from 'svelte';

	let bubble = $state(undefined);

	let expandDelay = $derived(routeState.getIntro() ? 60 : 3300);

	const routeIndex = 0;

	let route = $state(routeState.getRoutes()[routeIndex]);

	$effect(() => {
		route = routeState.getRoutes()[routeIndex];
		let active = route.active;

		if (!active) {
			bubble.shrink();
		}
	});

	onMount(() => {
		bubble.expand();

		routeState.setBubble(bubble, routeIndex);
	});
</script>

<Bubble
	bind:this={bubble}
	destroyContentOnShrink={false}
	onclick={() => {
		routeState.set(routeIndex);
	}}
	onExpand={() => {
		routeState.setIntro(true);
	}}
	class={`${routeState.getIntro() ? route?.initialClass + ' m-0' : ''} text-white bg-${route.primaryColor}-800`}
	coverClass={`hover:cursor-pointer bg-${route.primaryColor}-800`}
	{expandDelay}
	{route}
	initDelayFactor={routeIndex}
	initDelay={1000}
	ascend={true}
>
	<div class="flex h-full flex-col items-center justify-between">
		<div class="relative z-30 flex flex-col justify-center gap-2 pt-12">
			<div class="mt-28 flex w-max gap-4">
				<DropInFromAbove defaultDelay={2500}>
					<div
						class="relative flex aspect-square w-52 items-center justify-center rounded-full bg-slate-100 bg-opacity-5"
					>
						<div
							class="absolute bottom-0 left-0 right-0 top-0 z-0 m-auto h-1/2 w-1/2 overflow-visible rounded-full bg-gray-50 bg-opacity-5"
						></div>

						<img
							src="/dev/pp.png"
							alt=""
							class="relative z-10 h-full w-full object-cover object-center"
						/>
					</div>
				</DropInFromAbove>

				<div class="-ml-20 flex flex-col items-center justify-center gap-1 p-2">
					<LeftToRightFadeInDownText
						entryDelay={5300}
						class="w-full text-center text-3xl font-bold "
						>Hello,
					</LeftToRightFadeInDownText>

					<LeftToRightFadeInDownText
						class="ml-4 w-full text-end text-lg font-bold"
						entryDelay={6000}
						>My name is
					</LeftToRightFadeInDownText>
					<LeftToRightFadeInDownText
						byWord={true}
						class="w-full text-end text-4xl font-bold"
						entryDelay={6500}
					>
						Atif
					</LeftToRightFadeInDownText>

					<LeftToRightFadeInDownText class="mt-10 w-full text-2xl font-bold" entryDelay={7400}
						>And
					</LeftToRightFadeInDownText>
				</div>
			</div>
			<LeftToRightFadeInDownText class="mt-5 w-full text-sm font-bold" entryDelay={8000}
				>I am a
			</LeftToRightFadeInDownText>
			<LeftToRightFadeInDownText
				byWord={true}
				class="w-full text-end text-4xl font-bold"
				entryDelay={8600}
				>Software Developer
			</LeftToRightFadeInDownText>

			<!-- <FadeIn defaultDelay={8800} class="mr-3 flex justify-end">
				<button
					onclick={() => {
						routeState.set(2);
						// bubble.shrink();

						// let targetBubble = routeState.getRoutes()[2].bubble;

						// targetBubble.expand();
					}}
					class="text-end text-sm underline">More About Me</button
				>
			</FadeIn> -->
		</div>

		<div class="flex gap-8 py-6">
			<DropInFromBottom defaultDelay={8600} delayFactor={1}>
				<a href="https://discord.com/channels/wof12345">
					<IconBrandDiscord />
				</a>
			</DropInFromBottom>

			<DropInFromBottom defaultDelay={8600} delayFactor={1.05}>
				<a href="https://www.facebook.com/wof12345w">
					<IconBrandFacebook />
				</a>
			</DropInFromBottom>

			<DropInFromBottom defaultDelay={8600} delayFactor={1.1}>
				<a href="https://github.com/wof12345">
					<IconBrandGithub />
				</a>
			</DropInFromBottom>

			<DropInFromBottom defaultDelay={8600} delayFactor={1.15}>
				<a href="https://x.com/wof1234567890">
					<IconBrandX />
				</a>
			</DropInFromBottom>
			<DropInFromBottom defaultDelay={8600} delayFactor={1.2}>
				<a href="https://www.linkedin.com/in/atif-bin-ferdous-1b3602281">
					<IconBrandLinkedin />
				</a>
			</DropInFromBottom>
		</div>
	</div>

	{#snippet coverChildren()}
		{@const CoverIcon = route.icon}
		<div class="text-xl font-extrabold">
			<CoverIcon />
		</div>
	{/snippet}
</Bubble>
