import { error } from '@sveltejs/kit';
import projectsJson from '$lib/data/projects.json';

/** @typedef {{ live?: string, github?: string }} ProjectLinks */

/**
 * `links` is optional per project, so widen the shape inferred from the JSON —
 * otherwise only the keys that happen to be used today are known to the types.
 * @type {(Omit<(typeof projectsJson)[number], 'links'> & { links?: ProjectLinks })[]}
 */
const projects = projectsJson;

const descriptions = /** @type {Record<string, string>} */ (
	import.meta.glob('/src/lib/data/description/*.html', {
		query: '?raw',
		import: 'default',
		eager: true
	})
);

export const prerender = true;

export function load({ params }) {
	const project = projects.find((p) => p.id === params.id);

	if (!project) {
		error(404, `Project not found: ${params.id}`);
	}

	const longDescription = descriptions[`/src/lib/data/description/${params.id}.html`] ?? null;

	return { project, longDescription };
}

export function entries() {
	return projects.map((p) => ({ id: p.id }));
}
