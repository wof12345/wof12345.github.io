<script>
	import { onMount } from 'svelte';

	/**
	 * @type {{
	 *   phase: import('./timeline').Phase,
	 *   station: number,
	 *   onready?: (ready: Promise<void>) => void,
	 *   ondragchange?: (dragging: boolean) => void
	 * }}
	 */
	let { phase, station, onready, ondragchange } = $props();

	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {ReturnType<typeof import('./engine').createSpace> | undefined} */
	let space = $state();

	onMount(() => {
		let disposed = false;
		/** @type {() => void} */
		let onResize = () => {};

		// three.js is loaded lazily so the first paint stays blank and fast.
		import('./engine').then(({ createSpace }) => {
			if (disposed) return;
			space = createSpace(canvas, { onDragChange: (d) => ondragchange?.(d) });
			onResize = () => space?.resize();
			window.addEventListener('resize', onResize);
			onready?.(space.ready);
		});

		return () => {
			disposed = true;
			window.removeEventListener('resize', onResize);
			space?.dispose();
		};
	});

	$effect(() => space?.setPhase(phase));
	$effect(() => space?.setStation(station));
</script>

<canvas bind:this={canvas} class="fixed inset-0 block h-full w-full" aria-hidden="true"></canvas>
