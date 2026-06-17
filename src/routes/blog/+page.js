export const prerender = true;

export async function load() {
	const modules = import.meta.glob('/src/posts/*.md', { eager: true });

	const posts = Object.entries(modules).map(([path, mod]) => {
		const slug = path.split('/').pop().replace('.md', '');
		return {
			slug,
			...(mod.metadata ?? {})
		};
	});

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
}
