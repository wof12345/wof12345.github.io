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

	// Neighbours in the experience timeline, for "previous / next stop" links.
	const index = companies.indexOf(company);
	const newer = companies[index - 1] ?? null;
	const older = companies[index + 1] ?? null;

	return { company, relatedProjects, newer, older };
}

export function entries() {
	return companies.map((c) => ({ id: c.id }));
}
