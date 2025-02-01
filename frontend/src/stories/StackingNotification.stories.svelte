<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import StackingNotification from '$lib/components/StackingNotification/StackingNotification.svelte';
	import { fn } from '@storybook/test';
	import { stackingNotificationStore } from '$lib/components/StackingNotification/store.svelte.js';

	let array = [
		{
			id: 1,
			message: 'You have a new notification 1! asdasdas asd asd asd asd asda sdsa',
			type: 'success'
		},
		{ id: 1, message: 'You have a new notification! 2', type: 'success' },
		{ id: 1, message: 'You have a new notification! 3', type: 'success' },
		{ id: 1, message: 'You have a new notification! 4', type: 'success' },
		{ id: 1, message: 'You have a new notification! 5', type: 'success' },
		{ id: 1, message: 'You have a new notification! 6', type: 'success' },
		{ id: 1, message: 'You have a new notification! 7', type: 'success' },
		{ id: 1, message: 'You have a new notification! 8', type: 'success' },
		{ id: 1, message: 'You have a new notification! 9', type: 'success' }
	];

	stackingNotificationStore.updateNotifications(array);

	const { Story } = defineMeta({
		title: 'Example/StackingNotification',
		component: StackingNotification,
		tags: ['autodocs'],
		argTypes: {
			show: { control: 'number' },
			animationDelayBase: { control: 'number' },
			defaultGap: { control: 'number' },
			removeNotificationOnClick: { control: 'boolean' }
		},
		args: {
			show: 3,
			animationDelayBase: 100,
			defaultGap: 20,
			onNotificationClick: fn(),
			removeNotificationOnClick: true
		}
	});
</script>

<Story name="Primary" args={{ show: 3 }} />
