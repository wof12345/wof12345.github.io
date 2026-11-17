/**
 * Decides how much 3D the visitor's device gets.
 *
 * - high: full textures (2048 + normal/specular maps), dense geometry, AA
 * - low:  ~1/4 of the texture weight, lighter geometry, capped resolution
 * - off:  no WebGL at all; a static CSS backdrop stands in for the scene
 *
 * The first guess comes from the device (WebGL2 support, GPU, cores, memory,
 * touch, data saver). The engine then watches the real frame rate and backs
 * off further if the guess was too optimistic (see `onSlow` in engine.js).
 *
 * `?quality=high|low|off` forces a tier and remembers it; `?quality=auto`
 * clears that.
 *
 * @typedef {'high' | 'low' | 'off'} Tier
 */

const FORCED_KEY = 'space-quality';
// A downgrade learned from a slow frame rate lasts for the browser session.
const LEARNED_KEY = 'space-quality-learned';
const TIERS = ['high', 'low', 'off'];

/**
 * Storage can throw (private mode, blocked site data), even on access to
 * `window.localStorage` itself; treat that as empty.
 * @typedef {'localStorage' | 'sessionStorage'} Store
 */
const storage = {
	/** @param {Store} s @param {string} key */
	get(s, key) {
		try {
			return window[s].getItem(key);
		} catch {
			return null;
		}
	},
	/** @param {Store} s @param {string} key @param {string | null} value */
	set(s, key, value) {
		try {
			if (value === null) window[s].removeItem(key);
			else window[s].setItem(key, value);
		} catch {
			// not persisted; the guess is simply redone next time
		}
	}
};

/** @param {string | null} t @returns {t is Tier} */
const isTier = (t) => t !== null && TIERS.includes(t);

/** @returns {Tier} */
function probeDevice() {
	// three.js r163+ only renders through WebGL2.
	const canvas = document.createElement('canvas');
	const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
	if (!gl) return 'off';

	const info = gl.getExtension('WEBGL_debug_renderer_info');
	const gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
	const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);
	gl.getExtension('WEBGL_lose_context')?.loseContext();

	// CPU rasterisers: WebGL "works" but every frame is drawn on the CPU.
	if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) return 'off';
	if (maxTexture < 4096) return 'low';

	const nav =
		/** @type {Navigator & { deviceMemory?: number, connection?: { saveData?: boolean, effectiveType?: string } }} */ (
			navigator
		);
	if (nav.connection?.saveData || /2g|3g/.test(nav.connection?.effectiveType ?? '')) return 'low';
	// Phones and tablets: smaller screens, tighter thermal and data budgets.
	if (matchMedia('(pointer: coarse)').matches) return 'low';
	if ((nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory ?? 8) <= 4) return 'low';
	return 'high';
}

/** @returns {Tier} */
export function detectTier() {
	const param = new URLSearchParams(location.search).get('quality');
	if (param === 'auto') storage.set('localStorage', FORCED_KEY, null);
	else if (isTier(param)) storage.set('localStorage', FORCED_KEY, param);

	const forced = storage.get('localStorage', FORCED_KEY);
	if (isTier(forced)) return forced;

	const probed = probeDevice();
	const learned = storage.get('sessionStorage', LEARNED_KEY);
	// Never upgrade past what the device probe allows.
	if (isTier(learned) && TIERS.indexOf(learned) > TIERS.indexOf(probed)) return learned;
	return probed;
}

/**
 * Records that `tier` ran too slowly and returns the tier to use instead.
 * @param {Tier} tier
 * @returns {Tier}
 */
export function downgrade(tier) {
	const next = tier === 'high' ? 'low' : 'off';
	storage.set('sessionStorage', LEARNED_KEY, next);
	return next;
}
