<script>
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Navigation>
		{@render children()}
	</Navigation>
</ParaglideJS>
