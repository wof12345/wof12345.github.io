import { IconExclamationMark, IconHome, IconMail, IconStack } from '@tabler/icons-svelte';

function routeStateController() {
	let routes = $state([
		{
			name: 'Home',
			active: true,
			icon: IconHome,
			initialClass: 'left-7 top-[40px] z-30'
		},
		{
			name: 'Projects',
			active: false,
			icon: IconStack,
			initialClass: 'left-7 top-[110px] z-30'
		},
		{
			name: 'About',
			active: false,
			icon: IconExclamationMark,
			initialClass: 'left-7 top-[180px] z-30'
		},
		{
			name: 'Contact',
			active: false,
			icon: IconMail,
			initialClass: 'left-7 top-[250px] z-30'
		}
	]);
	let activeRoute = $state(routes[0]);
	let introComplete = $state(false);
	let activeAnimation = $state(false);

	return {
		set(index) {
			routes.forEach((route) => {
				route.active = false;
			});

			routes[index].active = true;
			activeRoute = routes[index];

			routes = [...routes];
		},
		setIntro(state = true) {
			introComplete = state;
		},
		setAnimationStatus(state = true) {
			activeAnimation = state;
		},
		getAnimationStatus() {
			return activeAnimation;
		},
		getIntro() {
			return introComplete;
		},
		getRoutes() {
			return routes;
		},
		get() {
			return activeRoute;
		}
	};
}

export const routeState = routeStateController();
