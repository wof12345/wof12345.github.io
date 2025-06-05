export async function smoothScrollTo(targetY, duration = 1000) {
	const startY = window.scrollY;
	const distance = targetY - startY;

	return new Promise((resolve) => {
		let startTime = null;

		function step(currentTime) {
			if (!startTime) startTime = currentTime;
			const progress = currentTime - startTime;
			const percent = Math.min(progress / duration, 1);

			window.scrollTo(0, startY + distance * easeInOutQuad(percent));

			if (progress < duration) {
				requestAnimationFrame(step);
			} else {
				resolve(false); // Resolve with false when animation completes
			}
		}

		function easeInOutQuad(percent) {
			return percent < 0.5 ? 2 * percent * percent : -1 + (4 - 2 * percent) * percent;
		}

		requestAnimationFrame(step);
	});
}

export async function scrollToSection(id) {
	const el = document.getElementById(id);

	if (el) {
		const y = el.offsetTop;
		return await smoothScrollTo(y, 2000); //(px, ms)
	}
}
