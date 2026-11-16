/**
 * "Builder" content, drawn from work experience (InnovationWithin backend
 * role). Each area is one card on the Builder station.
 *
 * @typedef {Object} BuildArea
 * @property {string}   id
 * @property {string}   title
 * @property {string}   summary
 * @property {string[]} points
 * @property {string[]} tags
 */

export const headline = 'Builder';

/** Dictionary-style definition shown when hovering the headline. */
export const headlineDefinition = {
	pronunciation: '/ˈbɪl·dər/',
	partOfSpeech: 'noun',
	meaning:
		'A person who designs and constructs things — taking an idea from sketch to something real that works and keeps working.'
};

export const tagline =
	'I design and ship systems end to end — AI agents and pipelines, event-driven backends, and the platform underneath them.';

/** @type {BuildArea[]} */
export const areas = [
	{
		id: 'agents',
		title: 'Agents & AI pipelines',
		summary: 'LLM-powered flows that run unattended and recover on their own.',
		points: [
			'AI transcript auto-correction, from detection in an event-driven Lambda to apply / reject / undo APIs',
			'Opt-in automatic correction and analysis flow, gated by per-user settings and org feature flags',
			'AI insight-generation ECS worker with retry, backoff, idempotent status writes and crash recovery',
			'Versioned prompt library on PostgreSQL JSONB'
		],
		tags: ['OpenAI', 'Portkey', 'Lambda', 'ECS', 'SQS']
	},
	{
		id: 'system-design',
		title: 'System design',
		summary: 'Breaking big systems into pieces that can change without breaking each other.',
		points: [
			'Split a legacy Express monolith into domain modules without breaking frontend contracts',
			'Designed a standalone meeting-webhook service and weighed SQS vs HTTP handoff',
			'Migrated meeting and recording state from DynamoDB to relational tables',
			'Set team conventions for layering, query builders and naming'
		],
		tags: ['Node.js', 'PostgreSQL', 'MySQL', 'DynamoDB', 'Event-driven']
	},
	{
		id: 'performance',
		title: 'Performance & platform',
		summary: 'Measuring every layer before changing any of them.',
		points: [
			'~530 ms cut from every correction click; server time per request nearly halved',
			'Auth middleware 210 ms → 50 ms by reusing tokens and dropping duplicate lookups',
			'Led the Node 18 → 22 → 24 upgrade across API, Lambda and ECS services',
			'CloudWatch Logs Insights instrumentation for webhook timeouts'
		],
		tags: ['AWS', 'Profiling', 'Express 5', 'AWS SDK v3', 'Docker']
	}
];
