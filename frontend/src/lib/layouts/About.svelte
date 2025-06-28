<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';
	import { IconExclamationCircleFilled, IconExclamationMark } from '@tabler/icons-svelte';

	let visible = $state(false);
	let style = $state('');
</script>

<DropInFromAbove defaultDelay={1000}>
	<Bubble
		expand={visible}
		class="left-10 m-0"
		{style}
		coverClass={`bg-white hover:cursor-pointer`}
		expandDelay={400}
		onclick={() => {
			// style = 'left: 50%; transition: 1s;';

			visible = true;
		}}
	>
		{#snippet coverChildren()}
			<div class="text-lg font-bold text-black"><IconExclamationMark /></div>
		{/snippet}

		Text
	</Bubble>
</DropInFromAbove>
