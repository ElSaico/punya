import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8787',
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
	plugins: [sveltekit(), tailwindcss()]
});
