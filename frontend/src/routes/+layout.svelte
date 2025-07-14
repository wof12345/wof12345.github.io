<script>
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import { onMount } from 'svelte';
	import { tabVisibleState } from '$lib/stores/dom.svelte';

	let { children } = $props();

	onMount(() => {
		tabVisibleState.set(document.visibilityState === 'visible');

		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				tabVisibleState.set(true);
			} else if (document.visibilityState === 'hidden') {
				tabVisibleState.set(false);
			}
		});
	});
</script>

<ParaglideJS {i18n}>
	<!-- <Navigation> -->
	{@render children()}
	<!-- </Navigation> -->
</ParaglideJS>
