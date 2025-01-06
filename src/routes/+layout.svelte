<script lang="ts">
	import '../app.css';
	import { AppBar, Navigation, Switch } from '@skeletonlabs/skeleton-svelte';
	import {
		BadgeCent,
		BadgeDollarSign,
		Cast,
		Columns4,
		Crosshair,
		Gem,
		Gift,
		HardDriveDownload,
		HardDriveUpload,
		Icon,
		Moon,
		Package,
		Refrigerator,
		Rocket,
		ShoppingBasket,
		Siren,
		Sun,
		Trash2
	} from 'lucide-svelte';
	import { chest, toolbox } from '@lucide/lab';
	import { page } from '$app/state';

	const { children } = $props();
	let mode = $state(false);
	let path = $derived(page.url.pathname);

	function handleModeChange() {
		document.documentElement.classList.toggle('dark', !mode);
	}

	$effect(() => {
		handleModeChange();
	});
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<AppBar border="border-b-[1px] border-surface-200-800">
		{#snippet lead()}
			<span class="text-2xl font-semibold tracking-tight">Punya</span>
		{/snippet}
		{#snippet trail()}
			<Switch
				name="mode"
				controlActive="bg-surface-200"
				bind:checked={mode}
				onCheckedChange={handleModeChange}
			>
				{#snippet inactiveChild()}<Moon size="14" />{/snippet}
				{#snippet activeChild()}<Sun size="14" />{/snippet}
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
				<Navigation.Tile labelExpanded="Bounty hunting" href="/bounties" id="/bounties">
					<!-- Undermining origins must be Delaine -->
					<Siren />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Crimes" href="/crimes" id="/crimes">
					<!-- Undermining origins only -->
					<Columns4 />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Escape pods" href="/pods" id="/pods">
					<!-- target station needs power contact (unavailable on Anarchy) -->
					<Refrigerator />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Salvage" href="/salvage" id="/salvage">
					<!-- target station needs power contact (unavailable on Anarchy)
							 no Acquisition (or Anarchy, obviously) origins -->
					<Trash2 />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Power kills" href="/power-kills" id="/power-kills">
					<!-- Anarchy filter is useful -->
					<Crosshair />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Megaships" href="/megaships" id="/megaships">
					<!-- non-dockable types only
							 does Spansh even list them? -->
					<Rocket />
				</Navigation.Tile>

				<Navigation.Tile labelExpanded="Restore/Reactivate" href="/restore" id="/restore">
					<!-- no Undermining origins -->
					<Icon iconNode={toolbox} />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Support missions" href="/support" id="/support">
					<!-- Acquisition origins must be under conflict -->
					<Gift />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Holoscreen hacking" href="/holoscreen" id="/holoscreen">
					<Cast />
				</Navigation.Tile>
				<Navigation.Tile
					labelExpanded="Power commodities"
					href="/power-commodities"
					id="/power-commodities"
				>
					<!-- Reinforcement target must be on a different system -->
					<Package />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Market flood" href="/market-flood" id="/market-flood">
					<!-- Acquisition conflict or Undermining targets only -->
					<BadgeCent />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="High-profit sales" href="/high-profit" id="/high-profit">
					<!-- no Undermining targets
							 Acquisition targets have (unknown?) location requirement -->
					<BadgeDollarSign />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Mining" href="/mining" id="/mining">
					<!-- targets have (unknown?) location requirement -->
					<Gem />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Rare goods" href="/rares" id="/rares">
					<!-- no Undermining targets
							 must be legal on target -->
					<ShoppingBasket />
				</Navigation.Tile>

				<Navigation.Tile labelExpanded="Power goods" href="/power-goods" id="/power-goods">
					<Icon iconNode={chest} />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Power data" href="/power-data" id="/power-data">
					<!-- Odyssey settlements only
							 Reinforcement targets don't accept Research or Industrial
							 settlement economy influences type availability
							 Anarchy filter is useful -->
					<HardDriveDownload />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Power malware" href="/power-malware" id="/power-malware">
					<!-- Odyssey settlements only
							 no Reinforcement origins -->
					<HardDriveUpload />
				</Navigation.Tile>
			{/snippet}
			{#snippet footer()}{/snippet}
		</Navigation.Rail>
		<main class="space-y-4 p-4">
			{@render children()}
		</main>
	</div>
</div>
