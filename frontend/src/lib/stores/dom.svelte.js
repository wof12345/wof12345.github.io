function scrollStateController() {
	let scrollAmount = $state();

	return {
		set(scroll) {
			scrollAmount = scroll;
		},
		get() {
			return scrollAmount;
		}
	};
}

export const scrollState = scrollStateController();

function tabVisibleStateController() {
	let visible = $state(false);

	return {
		set(scroll) {
			visible = scroll;
		},
		get() {
			return visible;
		}
	};
}

export const tabVisibleState = tabVisibleStateController();
