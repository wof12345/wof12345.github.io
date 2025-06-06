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
