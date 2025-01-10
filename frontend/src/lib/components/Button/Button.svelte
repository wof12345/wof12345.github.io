<script>
	let props = $props();
</script>

<button onclick={(e) => props.onclick(e)} class={'' + props.class}>
	{@render props.children?.()}</button
>
