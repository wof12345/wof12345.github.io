<script>
	/**
	 * Full-screen overlay for one station. Inactive stations fade out and are
	 * removed from the tab order. `direction` sets which way the content
	 * leaves: up if behind the visitor, down if ahead.
	 * @type {{ id: string, active: boolean, direction: number, label: string, class?: string, children: import('svelte').Snippet }}
	 */
	let { id, active, direction, label, class: className = '', children } = $props();
</script>

<section
	{id}
	aria-label={label}
	aria-hidden={!active}
	inert={!active}
	class="pointer-events-none fixed inset-0 z-20 flex items-center pr-12 pl-6 transition-all duration-700 ease-out sm:px-16 lg:px-24 {className}"
	style="opacity: {active ? 1 : 0}; transform: translateY({active
		? 0
		: direction * -6}vh) scale({active ? 1 : 0.97});"
>
	<div class="pointer-events-auto w-full">
		{@render children()}
	</div>
</section>
