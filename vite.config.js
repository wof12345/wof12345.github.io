import { paraglideVitePlugin } from '@inlang/paraglide-js';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.svx', '.md'],
			preprocess: [
				vitePreprocess(),
				mdsvex({
					extensions: ['.svx', '.md']
				})
			],
			adapter: adapter({
				fallback: '404.html'
			}),
			paths: {
				base: ''
			},
			// SvelteKit 3 replaced $lib with #lib; keep the old alias working.
			alias: {
				$lib: 'src/lib'
			}
		}),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			// Locale comes from the URL prefix (/de/about), English is unprefixed.
			strategy: ['url', 'baseLocale']
		})
	]
});
