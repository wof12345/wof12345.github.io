<!--
	Stand-in for the 3D scene on devices that can't render it (see quality.js):
	tiled CSS star layers and a faint earth-glow. No WebGL or textures are loaded.
-->
<div class="backdrop pointer-events-none fixed inset-0 bg-black" aria-hidden="true">
	<div class="glow absolute inset-0"></div>
	<div class="stars absolute inset-0"></div>
</div>

<style>
	.glow {
		background:
			radial-gradient(40vmax 40vmax at 78% 30%, rgb(70 120 255 / 0.16), transparent 70%),
			radial-gradient(60vmax 50vmax at 10% 100%, rgb(120 90 255 / 0.08), transparent 70%);
	}
	@media (orientation: portrait) {
		.glow {
			background:
				radial-gradient(60vmax 40vmax at 60% 8%, rgb(70 120 255 / 0.18), transparent 70%),
				radial-gradient(60vmax 50vmax at 10% 100%, rgb(120 90 255 / 0.08), transparent 70%);
		}
	}
	.stars {
		/* Three tiles of different sizes so the repeat isn't obvious. */
		background-image:
			radial-gradient(1px 1px at 23px 41px, #fff, transparent),
			radial-gradient(1px 1px at 157px 88px, rgb(255 255 255 / 0.7), transparent),
			radial-gradient(1.5px 1.5px at 91px 173px, rgb(190 215 255 / 0.9), transparent),
			radial-gradient(1px 1px at 211px 19px, rgb(255 230 190 / 0.8), transparent),
			radial-gradient(1px 1px at 61px 131px, rgb(255 255 255 / 0.5), transparent),
			radial-gradient(1px 1px at 300px 240px, rgb(255 255 255 / 0.6), transparent),
			radial-gradient(2px 2px at 380px 60px, rgb(255 255 255 / 0.9), transparent);
		background-size:
			230px 230px,
			230px 230px,
			310px 310px,
			310px 310px,
			170px 170px,
			430px 430px,
			470px 470px;
		animation: twinkle 7s ease-in-out infinite alternate;
	}
	@keyframes twinkle {
		to {
			opacity: 0.65;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.stars {
			animation: none;
		}
	}
</style>
