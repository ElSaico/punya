<script lang="ts">
	import { getUrlQuery, isUrlQuery, setUrlQuery, toggleUrlQuery } from '$lib/utils';
	import '../app.css';

	const { children } = $props();

	const apps = [
		['cb', 'Combat'],
		['mf', 'Market flood'],
		['mg', 'Megaships'],
		['mn', 'Mining'],
		['ms', 'Missions'],
		['sr', 'Search and Rescue'],
		['st', 'Settlements']
	];
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<nav class="navbar bg-base-300 shadow-sm">
		<div class="navbar-start">
			<span class="btn btn-ghost text-xl">Punya</span>
		</div>
		<div class="navbar-center">
			<select
				class="select"
				bind:value={() => getUrlQuery('power'), (p) => setUrlQuery('power', p)}
			>
				<option disabled selected value={null}>Select your power</option>
				<option value="A. Lavigny-Duval">Arissa Lavigny-Duval</option>
				<option>Aisling Duval</option>
				<option>Archon Delaine</option>
				<option>Denton Patreus</option>
				<option>Edmund Mahon</option>
				<option>Felicia Winters</option>
				<option>Jerome Archer</option>
				<option>Li Yong-Rui</option>
				<option>Nakato Kaine</option>
				<option>Pranav Antal</option>
				<option>Yuri Grom</option>
				<option>Zemina Torval</option>
			</select>
		</div>
		<div class="navbar-end join">
			{#each apps as [app, label]}
				<button
					class={{
						'btn btn-primary join-item': true,
						'btn-active': isUrlQuery(app)
					}}
					onclick={() => toggleUrlQuery(app)}
				>
					{label}
				</button>
			{/each}
		</div>
	</nav>
	<main class="space-y-4 p-4">
		{@render children()}
	</main>
</div>
