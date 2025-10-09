<script lang="ts">
	import { HomeIcon } from 'heroicons-svelte/24/outline';
	import { page } from '$app/state';

	import '../app.css';

	const { children } = $props();

	const apps = [
		{ href: '/', icon: HomeIcon },
		{ href: '/combat', title: 'Combat' },
		{ href: '/market-flood', title: 'Market flood' },
		{ href: '/megaships', title: 'Megaships' },
		{ href: '/missions', title: 'Missions' },
		{ href: '/search-rescue', title: 'Search and Rescue' },
		{ href: '/settlements', title: 'Settlements' }
	];
</script>

<div class="container mx-auto flex h-screen flex-col pt-4">
	<ul
		class="menu menu-horizontal bg-base-300 menu-lg flex w-full border-t border-b-2 px-0 py-0.5 font-mono"
	>
		{#each apps as app (app.href)}
			<li class={{ 'flex-none': app.icon, 'flex-auto': !app.icon }}>
				<a
					href={app.href}
					class={{
						'w-full place-content-center rounded-none py-0': true,
						'menu-active': page.route.id === app.href
					}}
				>
					{#if app.icon}<app.icon class="h-7 w-4" />{:else}{app.title}{/if}
				</a>
			</li>
		{/each}
	</ul>
	<main class="bg-base-200 border-b-2">
		{@render children()}
	</main>
</div>
