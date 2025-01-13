<script>
	import StackingNotification from '$lib/components/StackingNotification/StackingNotification.svelte';
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
</script>

<div>
	<StackingNotification show={4}>
		<!-- {#each stackingNotificationStore.getActiveNotifications as notification, index (notification.uuid)}
			<Notification
				class="flex w-[200px] items-center justify-center rounded-full bg-blue-400 px-2 text-white"
			>
				<div class="m-auto flex max-w-[90%] items-center justify-center gap-4">
					<div class="rounded-full bg-slate-200 p-2 text-blue-400">
						<IconBell size={26} />
					</div>

					<p class=" text-start">
						{notification.message}
					</p>
				</div>
			</Notification>
		{/each} -->
	</StackingNotification>
</div>
