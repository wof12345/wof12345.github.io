<script>
	let { children, tooltipSnippet } = $props();

	let isVisible = $state(false);
	let tooltipEl = $state();
	let mousePos = $state({ x: 0, y: 0 });
	let tooltipPos = $state({ x: 0, y: 0 });

	function portal(node) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) node.parentNode.removeChild(node);
			}
		};
	}

	function handleMouseMove(e) {
		mousePos = { x: e.clientX, y: e.clientY };
		if (isVisible) updateTooltipPosition();
	}

	function updateTooltipPosition() {
		if (!tooltipEl) return;

		const tooltipRect = tooltipEl.getBoundingClientRect();
		const padding = 15;
		const offset = 15;

		let x = mousePos.x + offset;
		let y = mousePos.y + offset;

		// Flip horizontal if overflow
		if (x + tooltipRect.width > window.innerWidth - padding) {
			x = mousePos.x - tooltipRect.width - offset;
		}
		if (x < padding) x = padding;

		// Flip vertical if overflow
		if (y + tooltipRect.height > window.innerHeight - padding) {
			y = mousePos.y - tooltipRect.height - offset;
		}
		if (y < padding) y = padding;

		tooltipPos = { x, y };
	}

	$effect(() => {
		if (isVisible) {
			// Small delay to let the element mount and get its dimensions
			requestAnimationFrame(updateTooltipPosition);
		}
	});
</script>

<div
	class="inline-block"
	onmouseenter={() => (isVisible = true)}
	onmouseleave={() => (isVisible = false)}
	onmousemove={handleMouseMove}
	role="tooltip"
>
	{@render children()}
</div>

{#if isVisible}
	<div
		use:portal
		bind:this={tooltipEl}
		class="fixed z-[10000] pointer-events-none rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-2xl transition-opacity duration-150"
		style:left="{tooltipPos.x}px"
		style:top="{tooltipPos.y}px"
		style:opacity={tooltipPos.x === 0 ? 0 : 1}
	>
		{@render tooltipSnippet()}
	</div>
{/if}
