/**
 * @typedef {Object} Company
 * @property {string} id           URL slug used by /company/[id]
 * @property {string} name         Display name (matches `company` on projects / experience)
 * @property {string} role         Role held at the company
 * @property {string} period       Human readable date range
 * @property {string} type         Employment type (Full-time, Internship, Founder, …)
 * @property {string} color        Brand / accent colour (hex)
 * @property {string} tagline      Short one-liner shown in the comic bubble
 * @property {string[]} description Paragraphs for the dedicated company page
 * @property {string | null} link  External website, if any
 */

/** @type {Company[]} */
export const companies = [
	{
		id: 'nanokingfisher',
		name: 'Nanokingfisher',
		role: 'Software Engineer',
		period: 'Oct 2025 — Present',
		type: 'Full-time',
		color: '#0ea5b5',
		tagline: 'Currently building here',
		description: [
			'Working as a software engineer across the stack — shipping features, refining the product, and keeping the codebase healthy as the team grows.',
			'Day to day I work on application logic, APIs, and the user-facing experience, with an emphasis on reliability and clean, maintainable code.'
		],
		link: null
	},
	{
		id: 'brownbrick',
		name: 'Brownbrick',
		role: 'Co-founder',
		period: '2024',
		type: 'Founder',
		color: '#bb9457',
		tagline: 'Co-founded this',
		description: [
			'Co-founded Brownbrick and helped take products from idea to launch — wearing both the engineering and product hats.',
			'Built Taajir, a full inventory-management and point-of-sale platform for small and medium businesses, with real-time stock tracking and sales analytics.'
		],
		link: 'https://brownbrick.io'
	},
	{
		id: 'liberate-labs',
		name: 'Liberate Labs',
		role: 'Software Engineer (Intern → Full-Time)',
		period: 'Aug 2023 — Feb 2024',
		type: 'Internship → Full-time',
		color: '#6366f1',
		tagline: 'Where I leveled up',
		description: [
			'Joined as an intern and grew into a full-time software engineer, contributing to production web applications alongside the team.',
			'Worked across frontend and backend tasks, learned to ship within a real engineering workflow, and turned the internship into a full-time role.'
		],
		link: null
	}
];

/** @type {Record<string, Company>} */
export const companiesById = Object.fromEntries(companies.map((c) => [c.id, c]));

/** @type {Record<string, Company>} */
export const companiesByName = Object.fromEntries(companies.map((c) => [c.name, c]));

/** @param {string | undefined | null} name */
export function companyHref(name) {
	if (!name) return null;
	const c = companiesByName[name];
	return c ? `/company/${c.id}` : null;
}
