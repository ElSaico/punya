<script lang="ts">
	import '../app.css';
	import { AppBar, Navigation, Switch } from '@skeletonlabs/skeleton-svelte';
	import MdiOctagramOutline from '~icons/mdi/octagram-outline';
	import MdiMoonAndStars from '~icons/mdi/moon-and-stars';
	import MdiWeatherSunny from '~icons/mdi/weather-sunny';
	import MdiTargetAccount from '~icons/mdi/target-account';
	import MdiMapSearch from '~icons/mdi/map-search';
	import MdiSpaceStation from '~icons/mdi/space-station';
	import MdiPeople from '~icons/mdi/people';
	import MdiInfinity from '~icons/mdi/infinity';
	import MdiPickaxe from '~icons/mdi/pickaxe';
	import MdiWarehouse from '~icons/mdi/warehouse';
	import { page } from '$app/state';

	const { children } = $props();
	let dark = $state(true); // TODO get default from media query
	let path = $derived(page.url.pathname);

	function toggleDark() {
		// TODO add state
		document.documentElement.classList.toggle('dark', dark);
	}

	$effect(() => {
		toggleDark();
	});
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<AppBar border="border-b-[1px] border-surface-200-800">
		{#snippet lead()}
			<MdiOctagramOutline width="40" height="40" />
			<span class="text-2xl font-semibold tracking-tight">Punya</span>
		{/snippet}
		{#snippet trail()}
			<Switch
				name="mode"
				controlActive="bg-surface-200"
				bind:checked={dark}
				onCheckedChange={toggleDark}
			>
				{#snippet inactiveChild()}<MdiWeatherSunny width="14" />{/snippet}
				{#snippet activeChild()}<MdiMoonAndStars width="14" />{/snippet}
			</Switch>
		{/snippet}
		<select class="select mx-auto w-64">
			<!-- TODO store your choice -->
			<option value="">Select your power...</option>
			<option>A. Lavigny-Duval</option>
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
	</AppBar>
	<div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
		<Navigation.Rail expanded value={path}>
			{#snippet header()}{/snippet}
			{#snippet tiles()}
				<Navigation.Tile labelExpanded="Combat" href="/combat" id="/combat">
					<MdiTargetAccount />
				</Navigation.Tile>
				<Navigation.Tile
					labelExpanded="Search and rescue"
					href="/search-rescue"
					id="/search-rescue"
				>
					<MdiMapSearch />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Megaships" href="/megaships" id="/megaships">
					<MdiSpaceStation />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Missions" href="/missions" id="/missions">
					<MdiPeople />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Market flood" href="/market-flood" id="/market-flood">
					<MdiInfinity />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Mining" href="/mining" id="/mining">
					<MdiPickaxe />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Settlements" href="/settlements" id="/settlements">
					<MdiWarehouse />
				</Navigation.Tile>
			{/snippet}
			{#snippet footer()}{/snippet}
		</Navigation.Rail>
		<main class="space-y-4 p-4">
			{@render children()}
		</main>
	</div>
</div>
