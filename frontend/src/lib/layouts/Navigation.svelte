<script>
	import DropInFromAbove from '$lib/components/Animated/Entity/DropInFromAbove.svelte';
	import Bubble from '$lib/components/Base/Bubble.svelte';

	let navItems = [
		{
			name: 'Home',
			icon: '',
			visible: false
		},
		{
			name: 'Projects',
			icon: '',
			visible: false
		},
		{
			name: 'About',
			icon: '',
			visible: false
		}
	];
</script>

{#each navItems as item, idx}
	<!-- <DropInFromAbove defaultDelay={300} delayFactor={idx + 1}> -->
	<Bubble
		expand={item.visible}
		class="top-[{(idx + 1) * 1}px] left-10 z-50 m-0"
		coverClass={`bg-white`}
		onclick={() => {
			item.visible = true;
			console.log(item);
		}}
	>
		{#snippet coverChildren()}
			<div class="text-lg font-bold text-black">
				{item.name.slice(0, 1)}
			</div>
		{/snippet}

		Text
	</Bubble>
	<!-- </DropInFromAbove> -->
{/each}
