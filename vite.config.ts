import { sveltekit } from '@sveltejs/kit/vite';
import unpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), unpluginIcons({ compiler: 'svelte', autoInstall: true })]
});
