<script>
	import Notification from '$lib/components/StackingNotification/Notification.svelte';
	import StackingNotification from '$lib/components/StackingNotification/StackingNotification.svelte';
	import { stackingNotificationStore } from '$lib/components/StackingNotification/store.svelte.js';

	let array = [
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' },
		{ id: 1, message: 'You have a new notification!', type: 'success' }
	];

	stackingNotificationStore.updateNotifications(array);
</script>

<div>
	<StackingNotification show={3}>
		<!-- {#each array as elm}
			<Notification>
				<div class="bg-red-50">
					{elm.message}
				</div>
			</Notification>
		{/each} -->
	</StackingNotification>
</div>
