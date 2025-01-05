import type { Config } from 'tailwindcss';
import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import { concord } from '@skeletonlabs/skeleton/themes';

export default {
	darkMode: 'selector',
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],
	plugins: [
		skeleton({
			themes: [concord]
		})
	]
} satisfies Config;
