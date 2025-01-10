<script>
	import Notification from '$lib/components/StackingNotification/Notification.svelte';
	import StackingNotification from '$lib/components/StackingNotification/StackingNotification.svelte';
	import { stackingNotificationStore } from '$lib/components/StackingNotification/store.svelte.js';

	let array = [
		{ id: 1, message: 'You have a new notification 1!', type: 'success' },
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
</script>

<div>
	<StackingNotification show={3}>
		{#each stackingNotificationStore.getActiveNotifications as notification, index (notification.uuid)}
			<Notification
				class="flex w-[200px] items-center justify-center rounded-full bg-blue-400 px-2 text-white"
			>
				{notification.message}
			</Notification>
		{/each}
	</StackingNotification>
</div>
