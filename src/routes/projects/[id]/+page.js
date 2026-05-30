import { error } from '@sveltejs/kit';
import projects from '$lib/data/projects.json';

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
