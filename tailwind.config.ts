import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import { rocket } from '@skeletonlabs/skeleton/themes';

export default {
	darkMode: 'selector',
	content: ['./src/**/*.{html,js,svelte,ts}', contentPath(import.meta.url, 'svelte')],
	plugins: [
		forms,
		skeleton({
			themes: [rocket]
		})
	]
} satisfies Config;
