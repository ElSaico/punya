<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import '../app.css';

	const { children } = $props();

	const powers = [
		'A. Lavigny-Duval',
		'Aisling Duval',
		'Archon Delaine',
		'Denton Patreus',
		'Edmund Mahon',
		'Felicia Winters',
		'Jerome Archer',
		'Li Yong-Rui',
		'Nakato Kaine',
		'Pranav Antal',
		'Yuri Grom',
		'Zemina Torval'
	];
	const apps = [
		['combat', 'Combat'],
		['market-flood', 'Market flood'],
		['megaships', 'Megaships'],
		['mining', 'Mining'],
		['missions', 'Missions'],
		['search-rescue', 'Search and Rescue'],
		['settlements', 'Settlements']
	];

	function toggleAppUrl(app: string) {
		const url = new URL(page.url);
		const visible = (url.searchParams.get(app) == 'false').toString();
		url.searchParams.set(app, visible);
		goto(url, { replaceState: false });
	}
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<span class="btn btn-ghost text-xl">Punya</span>
		</div>
		<div class="navbar-center">
			<select class="select">
				<option disabled selected>Select your power</option>
				{#each powers as power}
					<option>{power}</option>
				{/each}
			</select>
		</div>
		<div class="navbar-end join">
			{#each apps as [app, label]}
				<button
					class={{
						'btn btn-primary join-item': true,
						'btn-active': page.url.searchParams.get(app) === 'true'
					}}
					onclick={() => toggleAppUrl(app)}
				>
					{label}
				</button>
			{/each}
		</div>
	</div>
	<main class="space-y-4 p-4">
		{@render children()}
	</main>
</div>
