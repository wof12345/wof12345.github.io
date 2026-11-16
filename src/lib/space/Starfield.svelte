<script>
	import { onMount } from 'svelte';

	/**
	 * Lightweight 2D twinkling starfield for inner pages, so they share the
	 * home scene's sky without loading three.js.
	 * @type {{ count?: number }}
	 */
	let { count = 260 } = $props();

	/** @type {HTMLCanvasElement} */
	let canvas;

	onMount(() => {
		const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const stars = Array.from({ length: count }, () => ({
			x: Math.random(),
			y: Math.random(),
			r: Math.random() < 0.05 ? 1.4 + Math.random() : 0.4 + Math.random() * 0.8,
			phase: Math.random() * Math.PI * 2,
			speed: 0.5 + Math.random() * 1.5,
			// Staggered pop-in, like the home scene.
			appear: Math.random() * 2.5
		}));

		let w = 0;
		let h = 0;
		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio, 2);
			w = canvas.clientWidth;
			h = canvas.clientHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener('resize', resize);

		let frame = 0;
		const start = performance.now();
		const draw = (/** @type {number} */ now) => {
			const t = (now - start) / 1000;
			ctx.clearRect(0, 0, w, h);
			for (const s of stars) {
				const shown = Math.min(1, Math.max(0, (t - s.appear) / 0.3));
				if (!shown) continue;
				const twinkle = reduced ? 1 : 0.65 + 0.35 * Math.sin(t * s.speed + s.phase);
				ctx.globalAlpha = shown * twinkle;
				ctx.fillStyle = '#fff';
				ctx.beginPath();
				ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
				ctx.fill();
			}
			frame = requestAnimationFrame(draw);
		};
		frame = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 -z-10 h-full w-full"
	aria-hidden="true"
></canvas>
