import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load({ params }) {
	try {
		const post = await import(`../../../posts/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata ?? {},
			slug: params.slug
		};
	} catch (e) {
		error(404, `Post not found: ${params.slug}`);
	}
}

export async function entries() {
	const modules = import.meta.glob('/src/posts/*.md');
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop().replace('.md', '')
	}));
}
