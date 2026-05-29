<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import DropInFromBottom from '$lib/components/Animated/Entity/DropInFromBottom.svelte';
	import Floating from '$lib/components/Animated/Entity/Floating.svelte';
	import ScaleIn from '$lib/components/Animated/Entity/ScaleIn.svelte';
	import LeftToRightFadeInDownText from '$lib/components/Animated/Text/LeftToRightFadeInDownText.svelte';
	import {
		IconBrandDiscord,
		IconBrandFacebook,
		IconBrandGithub,
		IconBrandLinkedin,
		IconBrandX
	} from '@tabler/icons-svelte';

	const baseDelay = 200;
</script>

<section
	id="home"
	class="bg-primary-800 relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden text-white"
>
	<div class="relative z-30 flex flex-1 flex-col justify-center gap-2">
		<div class="mt-12 flex w-max gap-4">
			<DropInFromAbove defaultDelay={baseDelay}>
				<div class="relative flex aspect-square w-52 items-center justify-center">
					<ScaleIn
						class="absolute top-0 right-0 bottom-0 left-0 z-10 m-auto h-full w-full"
						defaultDelay={baseDelay + 1600}
					>
						<Floating class="h-full w-full" delayFactor={3} animationDurationFactor={3}>
							<div class="bg-opacity-5 h-full w-full rounded-full bg-slate-50/40"></div>
						</Floating>
					</ScaleIn>

					<ScaleIn
						class="absolute top-0 right-0 bottom-0 left-0 z-10 m-auto h-1/2 w-1/2"
						defaultDelay={baseDelay + 1000}
					>
						<Floating class="h-full w-full" delayFactor={2} animationDurationFactor={2}>
							<div class="bg-opacity-5 h-full w-full rounded-full bg-gray-50/50"></div>
						</Floating>
					</ScaleIn>

					<img
						src="/dev/pp.png"
						alt=""
						class="relative z-10 h-full w-full object-cover object-center"
					/>
				</div>
			</DropInFromAbove>

			<div class="-ml-20 flex flex-col items-center justify-center gap-1 p-2">
				<LeftToRightFadeInDownText
					entryDelay={baseDelay + 2800}
					class="w-full text-center text-3xl font-bold"
					>Hello,
				</LeftToRightFadeInDownText>

				<LeftToRightFadeInDownText
					class="ml-4 w-full text-end text-lg font-bold"
					entryDelay={baseDelay + 3800}
					>My name is
				</LeftToRightFadeInDownText>
				<LeftToRightFadeInDownText
					byWord={true}
					class="w-full text-end text-4xl font-bold"
					entryDelay={baseDelay + 4300}
				>
					Atif
				</LeftToRightFadeInDownText>

				<LeftToRightFadeInDownText
					class="mt-10 w-full text-2xl font-bold"
					entryDelay={baseDelay + 4900}
					>And
				</LeftToRightFadeInDownText>
			</div>
		</div>
		<LeftToRightFadeInDownText class="mt-5 w-full text-sm font-bold" entryDelay={baseDelay + 5800}
			>I am a
		</LeftToRightFadeInDownText>
		<LeftToRightFadeInDownText
			byWord={true}
			class="w-full text-end text-4xl font-bold"
			entryDelay={baseDelay + 6100}
			>Software Engineer
		</LeftToRightFadeInDownText>

		<div class="flex gap-8 py-6">
			<DropInFromBottom defaultDelay={baseDelay + 6100} delayFactor={1}>
				<a href="https://discord.com/channels/wof12345" target="_blank" aria-label="Discord">
					<IconBrandDiscord />
				</a>
			</DropInFromBottom>

			<DropInFromBottom defaultDelay={baseDelay + 6100} delayFactor={1.05}>
				<a href="https://www.facebook.com/wof12345w" target="_blank" aria-label="Facebook">
					<IconBrandFacebook />
				</a>
			</DropInFromBottom>

			<DropInFromBottom defaultDelay={baseDelay + 6100} delayFactor={1.1}>
				<a href="https://github.com/wof12345" target="_blank" aria-label="GitHub">
					<IconBrandGithub />
				</a>
			</DropInFromBottom>

			<DropInFromBottom defaultDelay={baseDelay + 6100} delayFactor={1.15}>
				<a href="https://x.com/wof1234567890" target="_blank" aria-label="X">
					<IconBrandX />
				</a>
			</DropInFromBottom>

			<DropInFromBottom defaultDelay={baseDelay + 6100} delayFactor={1.2}>
				<a
					href="https://www.linkedin.com/in/atif-bin-ferdous-1b3602281"
					target="_blank"
					aria-label="LinkedIn"
				>
					<IconBrandLinkedin />
				</a>
			</DropInFromBottom>
		</div>
	</div>

	<DropInFromBottom defaultDelay={baseDelay + 6100} delayFactor={1.3}>
		<div
			class="text-primary-200 absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-widest"
		>
			<span>Scroll</span>
			<div class="border-primary-200 h-8 w-px animate-pulse bg-current"></div>
		</div>
	</DropInFromBottom>
</section>
