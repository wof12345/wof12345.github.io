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
 * @property {string[]} [highlights] Concrete outcomes, shown as a list
 * @property {string | null} link  External website, if any
 */

/** @type {Company[]} */
export const companies = [
	{
		id: 'innovationwithin',
		name: 'InnovationWithin',
		role: 'Backend Engineer',
		period: '2026 — Present',
		type: 'Full-time',
		color: '#f5a524',
		tagline: 'Where I build now',
		description: [
			'Backend engineer on an AI-assisted customer-discovery platform that records, transcribes and analyses interviews.',
			'I own features across the Node.js API, AWS Lambda and ECS workers, and the platform runtime itself — with a focus on correctness, measured performance, and breaking a legacy monolith into pieces that can change safely.'
		],
		highlights: [
			'Built the AI transcript auto-correction pipeline end to end, from detection in an event-driven Lambda to apply, reject and undo APIs.',
			'Cut ~530 ms from every correction click by timing each layer; auth middleware went from ~210 ms to ~50 ms.',
			'Led the Node.js 18 → 22 → 24 upgrade across API, Lambda and ECS services, including AWS SDK v3 and Express 5.',
			'Decomposed a legacy Express monolith into domain modules without breaking frontend contracts.',
			'Designed a standalone meeting-webhook service, weighing SQS and HTTP handoff.',
			'Hardened the AI insight-generation worker with retries, backoff, idempotent status writes and crash recovery.'
		],
		link: null
	},
	{
		id: 'nanokingfisher',
		name: 'Nanokingfisher',
		role: 'Software Engineer',
		period: 'Aug 2025 — Jun 2026',
		type: 'Full-time',
		color: '#0ea5b5',
		tagline: 'Where I shipped most recently',
		description: [
			'Worked as a software engineer across the stack — shipping features, refining the product, and keeping the codebase healthy as the team grew.',
			'Day to day I worked on application logic, APIs, and the user-facing experience, with an emphasis on reliability and clean, maintainable code.'
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
