/**
 * Central SEO configuration for the site.
 *
 * Every page-level <Seo> component falls back to these defaults, and the
 * sitemap / robots endpoints read `siteUrl` from here, so the canonical
 * origin lives in exactly one place.
 */

/** Canonical origin (no trailing slash). */
export const siteUrl = 'https://wof12345.github.io';

/** Brand / site name used in <title> suffixes and Open Graph. */
export const siteName = 'Atif Bin Ferdous';

/** Person the portfolio is about. */
export const author = 'Atif Bin Ferdous';

/** Default <title> used on pages that don't set their own. */
export const defaultTitle = 'Atif Bin Ferdous — Full-Stack Software Engineer';

/** Default meta description. */
export const defaultDescription =
	'Portfolio of Atif Bin Ferdous, a full-stack software engineer who builds fast, accessible web applications with Svelte, TypeScript, and modern tooling.';

/** Default keywords applied site-wide. Page-level keywords are merged on top. */
export const defaultKeywords = [
	'Atif Bin Ferdous',
	'software engineer',
	'full-stack developer',
	'web developer',
	'frontend engineer',
	'Svelte',
	'SvelteKit',
	'TypeScript',
	'JavaScript',
	'Tailwind CSS',
	'portfolio',
	'Bangladesh'
];

/** Default sharing image (Open Graph / Twitter), absolute path from the site root. */
export const defaultImage = '/favicon.png';

/** Build an absolute URL from a site-root-relative path. */
export function absoluteUrl(path = '/') {
	if (/^https?:\/\//.test(path)) return path;
	return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
