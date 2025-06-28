export const routes = ['Home', 'Projects', 'About', 'Contact'];

function routeStateController() {
	let activeRoute = $state('Home');

	return {
		set(route) {
			activeRoute = route;
		},
		get() {
			return activeRoute;
		}
	};
}

export const routeState = routeStateController();
