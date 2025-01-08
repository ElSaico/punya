<script lang="ts">
	import '../app.css';
	import { AppBar, Navigation, Switch } from '@skeletonlabs/skeleton-svelte';
	import MdiOctagramOutline from '~icons/mdi/octagram-outline';
	import MdiMoonAndStars from '~icons/mdi/moon-and-stars';
	import MdiWeatherSunny from '~icons/mdi/weather-sunny';
	import MdiPoliceBadgeOutline from '~icons/mdi/police-badge-outline';
	import MdiDominoMask from '~icons/mdi/domino-mask';
	import MdiLifebuoy from '~icons/mdi/lifebuoy';
	import MdiRecycle from '~icons/mdi/recycle';
	import MdiTargetAccount from '~icons/mdi/target-account';
	import MdiSpaceStation from '~icons/mdi/space-station';
	import MdiRestore from '~icons/mdi/restore';
	import MdiGiftOpenOutline from '~icons/mdi/gift-open-outline';
	import MdiBroadcast from '~icons/mdi/broadcast';
	import MdiPackageVariant from '~icons/mdi/package-variant';
	import MdiCashMinus from '~icons/mdi/cash-minus';
	import MdiCashPlus from '~icons/mdi/cash-plus';
	import MdiJewel from '~icons/mdi/jewel';
	import MdiPickaxe from '~icons/mdi/pickaxe';
	import MdiTreasureChestOutline from '~icons/mdi/treasure-chest-outline';
	import MdiFileDownloadOutline from '~icons/mdi/file-download-outline';
	import MdiFileUploadOutline from '~icons/mdi/file-upload-outline';
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
				<Navigation.Tile labelExpanded="Bounty hunting" href="/bounties" id="/bounties">
					<!-- Undermining origins must be Delaine -->
					<MdiPoliceBadgeOutline />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Crimes" href="/crimes" id="/crimes">
					<!-- Undermining origins only -->
					<MdiDominoMask />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Escape pods" href="/pods" id="/pods">
					<!-- target station needs power contact (unavailable on Anarchy) -->
					<MdiLifebuoy />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Salvage" href="/salvage" id="/salvage">
					<!-- target station needs power contact (unavailable on Anarchy)
							 no Acquisition (or Anarchy, obviously) origins -->
					<MdiRecycle />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Power kills" href="/power-kills" id="/power-kills">
					<!-- Anarchy filter is useful -->
					<MdiTargetAccount />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Megaships" href="/megaships" id="/megaships">
					<!-- non-dockable types only
							 does Spansh even list them? -->
					<MdiSpaceStation />
				</Navigation.Tile>

				<Navigation.Tile labelExpanded="Restore/Reactivate" href="/restore" id="/restore">
					<!-- no Undermining origins -->
					<MdiRestore />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Support missions" href="/support" id="/support">
					<!-- Acquisition origins must be under conflict -->
					<MdiGiftOpenOutline />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Holoscreen hacking" href="/holoscreen" id="/holoscreen">
					<MdiBroadcast />
				</Navigation.Tile>
				<Navigation.Tile
					labelExpanded="Power commodities"
					href="/power-commodities"
					id="/power-commodities"
				>
					<!-- Reinforcement target must be on a different system -->
					<MdiPackageVariant />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Market flood" href="/market-flood" id="/market-flood">
					<!-- Acquisition conflict or Undermining targets only -->
					<MdiCashMinus />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="High-profit sales" href="/high-profit" id="/high-profit">
					<!-- no Undermining targets
							 Acquisition targets have (unknown?) location requirement -->
					<MdiCashPlus />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Rare goods" href="/rares" id="/rares">
					<!-- no Undermining targets
							 must be legal on target -->
					<MdiJewel />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Mining" href="/mining" id="/mining">
					<!-- targets have (unknown?) location requirement -->
					<MdiPickaxe />
				</Navigation.Tile>

				<Navigation.Tile labelExpanded="Power goods" href="/power-goods" id="/power-goods">
					<MdiTreasureChestOutline />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Power data" href="/power-data" id="/power-data">
					<!-- Odyssey settlements only
							 Reinforcement targets don't accept Research or Industrial
							 settlement economy influences type availability
							 Anarchy filter is useful -->
					<MdiFileDownloadOutline />
				</Navigation.Tile>
				<Navigation.Tile labelExpanded="Power malware" href="/power-malware" id="/power-malware">
					<!-- Odyssey settlements only
							 no Reinforcement origins -->
					<MdiFileUploadOutline />
				</Navigation.Tile>
			{/snippet}
			{#snippet footer()}{/snippet}
		</Navigation.Rail>
		<main class="space-y-4 p-4">
			{@render children()}
		</main>
	</div>
</div>
