import { error } from '@sveltejs/kit';
import { companies, companiesById } from '$lib/data/companies';
import projects from '$lib/data/projects.json';

export const prerender = true;

export function load({ params }) {
	const company = companiesById[params.id];

	if (!company) {
		error(404, `Company not found: ${params.id}`);
	}

	const relatedProjects = projects.filter((p) => p.company === company.name);

	return { company, relatedProjects };
}

export function entries() {
	return companies.map((c) => ({ id: c.id }));
}
