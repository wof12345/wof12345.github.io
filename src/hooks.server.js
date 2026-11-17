import { paraglideMiddleware } from '$lib/paraglide/server';
import { getTextDirection } from '$lib/paraglide/runtime';

// Routing already strips the locale prefix via `reroute` in hooks.js; this only
// sets the request locale and fills in the <html> lang/dir placeholders.
/** @type {import('@sveltejs/kit/hooks').Handle} */
const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ locale }) =>
		resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.textDirection%', getTextDirection(locale))
		})
	);

export const handle = handleParaglide;
