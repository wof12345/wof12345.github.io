<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import DropInFromBottom from '$lib/components/Animated/Entity/DropInFromBottom.svelte';
	import LeftToRightFadeInDown from '$lib/components/Animated/Text/LeftToRightFadeInDown.svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';
</script>

<DropInFromBottom>
	<Bubble class="le" expand={true} expandDelay={3300}>
		{#snippet coverChildren()}
			<div class="text-lg text-white">T</div>
		{/snippet}

		<div class="relative z-30 flex flex-col items-center justify-center pt-24">
			<DropInFromAbove defaultDelay={2500}>
				<div
					class="flex aspect-square w-52 items-center justify-center rounded-full bg-gray-50 bg-opacity-5"
				>
					<div class="h-full w-full overflow-hidden rounded-full">
						<img src="/dev/dev.jpg" alt="" class="object-cover object-center" />
					</div>
				</div>
			</DropInFromAbove>

			<div class="flex flex-col p-2">
				<LeftToRightFadeInDown
					entryDelay={5200}
					class="w-full text-center text-4xl font-bold text-white"
					>Hello,
				</LeftToRightFadeInDown>

				<LeftToRightFadeInDown
					class="text-md ml-20 w-full text-end font-bold text-white"
					entryDelay={6000}
					>My name is Atif
				</LeftToRightFadeInDown>
			</div>
		</div>
	</Bubble>
</DropInFromBottom>
