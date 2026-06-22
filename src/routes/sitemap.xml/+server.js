import { siteUrl } from '$lib/seo';
import { companies } from '$lib/data/companies';
import projects from '$lib/data/projects.json';

export const prerender = true;

/** Pull blog posts + their dates straight from the markdown frontmatter. */
function getPosts() {
	const modules = /** @type {Record<string, { metadata?: { date?: string } }>} */ (
		import.meta.glob('/src/posts/*.md', { eager: true })
	);

	return Object.entries(modules).map(([path, mod]) => ({
		slug: path.split('/').pop().replace('.md', ''),
		date: mod.metadata?.date ?? null
	}));
}

/**
 * @typedef {Object} UrlEntry
 * @property {string} path
 * @property {string} [lastmod]
 * @property {string} [changefreq]
 * @property {number} [priority]
 */

function buildUrls() {
	/** @type {UrlEntry[]} */
	const urls = [
		{ path: '/', changefreq: 'monthly', priority: 1.0 },
		{ path: '/about', changefreq: 'monthly', priority: 0.7 },
		{ path: '/cv', changefreq: 'monthly', priority: 0.8 },
		{ path: '/blog', changefreq: 'weekly', priority: 0.6 }
	];

	for (const post of getPosts()) {
		urls.push({
			path: `/blog/${post.slug}`,
			lastmod: post.date ? new Date(post.date).toISOString().split('T')[0] : undefined,
			changefreq: 'yearly',
			priority: 0.6
		});
	}

	for (const company of companies) {
		urls.push({ path: `/company/${company.id}`, changefreq: 'yearly', priority: 0.5 });
	}

	for (const project of projects) {
		urls.push({ path: `/projects/${project.id}`, changefreq: 'yearly', priority: 0.7 });
	}

	return urls;
}

export function GET() {
	const urls = buildUrls();

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map((url) => {
		const loc = `${siteUrl}${url.path}`;
		return [
			'\t<url>',
			`\t\t<loc>${loc}</loc>`,
			url.lastmod ? `\t\t<lastmod>${url.lastmod}</lastmod>` : null,
			url.changefreq ? `\t\t<changefreq>${url.changefreq}</changefreq>` : null,
			url.priority != null ? `\t\t<priority>${url.priority.toFixed(1)}</priority>` : null,
			'\t</url>'
		]
			.filter(Boolean)
			.join('\n');
	})
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
