/**
 * Content for the personal "More about me" page (/about).
 *
 * Everything the page renders is driven from this file, so adding a new
 * panel, fact, or "currently" line is a data edit — no markup changes needed.
 *
 * @typedef {Object} AboutPanel
 * @property {string}   id       Stable key (used for list rendering + anchors)
 * @property {string}   title    Panel heading
 * @property {string}   icon     Tabler icon name, resolved in the page
 * @property {string}   accent   Accent colour (hex) for the icon + glow
 * @property {string}   summary  One-liner shown while the panel is collapsed
 * @property {string[]} body     Paragraphs revealed when the panel expands
 * @property {string[]} [tags]   Optional chips shown under the body
 */

/** Short intro shown at the top of the page. */
export const intro = [
	"Beyond the code and commit history, I'm a curious person who likes building things — software, habits, the occasional piece of furniture.",
	"This page is the less-formal corner of the site: what I do when I'm away from the keyboard, how I like to spend my days, and where I'm hoping all of it leads."
];

/**
 * Quick facts rendered as a row of chips. Purely cosmetic, easy to extend.
 * @type {{ label: string, value: string }[]}
 */
export const quickFacts = [
	{ label: 'Based in', value: 'Mymensingh, Bangladesh' },
	{ label: 'Fuelled by', value: 'Coffee & curiosity' },
	{ label: 'Currently learning', value: 'ThreeJS' },
	{ label: 'Off-switch', value: 'Long walks & Gaming' }
];

/**
 * "Currently" snapshot — the kind of thing that changes often, so it lives
 * in its own small list that's trivial to update.
 * @type {{ label: string, value: string }[]}
 */
export const currently = [
	{ label: 'Reading', value: 'Sci-fi and the odd systems-design book' },
	{ label: 'Listening to', value: 'Lo-fi, jazz, and film scores while I work' },
	{ label: 'Tinkering with', value: 'A self-hosted homelab and small CLI tools' },
	{ label: 'Chasing', value: 'Shipping more, perfecting less' }
];

/** @type {AboutPanel[]} */
export const panels = [
	{
		id: 'hobbies',
		title: 'Hobbies',
		icon: 'IconMountain',
		accent: '#5da493',
		summary: 'The things I lose track of time doing.',
		body: [
			'Outside of work I gravitate toward anything hands-on. I hike when I can get out of the city, and there is a particular calm in being somewhere with no signal and nothing to ship.',
			'Closer to home, I read widely, mess around with photography, and fall into the occasional weekend project — half of which never get finished, which is entirely the point.'
		],
		tags: ['Hiking', 'Reading', 'Photography', 'Side projects']
	},
	{
		id: 'lifestyle',
		title: 'Lifestyle',
		icon: 'IconSun',
		accent: '#b39484',
		summary: 'How I like my days to actually feel.',
		body: [
			'I work best in long, quiet stretches — mornings for deep work, afternoons for the messier collaborative stuff. A good day has a clear win in it, however small.',
			'I try to keep things balanced: move every day, cook more than I order in, and protect enough downtime that the work stays fun rather than becoming a grind.'
		],
		tags: ['Deep work', 'Daily movement', 'Home cooking', 'Slow mornings']
	},
	{
		id: 'ambitions',
		title: 'Ambitions',
		icon: 'IconTargetArrow',
		accent: '#687cc8',
		summary: 'Where I want all of this to go.',
		body: [
			'I want to build products that real people rely on — software that is fast, accessible, and quietly well-made, where the craft shows up in how it feels to use rather than how it looks on a slide.',
			'Longer term, I would love to grow something of my own from idea to a small, sustainable business, and to keep mentoring and writing along the way so the things I learn do not just stay in my head.'
		],
		tags: ['Build for users', 'Found something', 'Mentor & write']
	},
	{
		id: 'values',
		title: 'What I value',
		icon: 'IconHeartHandshake',
		accent: '#a47c6b',
		summary: 'The principles I keep coming back to.',
		body: [
			'Curiosity over credentials, and shipping over theorising. I would rather build a rough version and learn from it than plan something perfect that never ships.',
			'Kindness and clarity matter to me as much as technical skill — the best teams I have worked on were honest, generous with context, and unafraid to keep things simple.'
		],
		tags: ['Curiosity', 'Honesty', 'Simplicity', 'Craft']
	}
];
