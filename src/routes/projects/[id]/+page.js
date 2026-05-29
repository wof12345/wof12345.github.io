import { error } from '@sveltejs/kit';
import projects from '$lib/data/projects.json';

export const prerender = true;

export function load({ params }) {
	const project = projects.find((p) => p.id === params.id);

	if (!project) {
		error(404, `Project not found: ${params.id}`);
	}

	return { project };
}

export function entries() {
	return projects.map((p) => ({ id: p.id }));
}
