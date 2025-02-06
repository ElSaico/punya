<script lang="ts">
	import { page } from '$app/state';

	import Combat from '$lib/components/combat.svelte';
	import MarketFlood from '$lib/components/market-flood.svelte';
	import Megaships from '$lib/components/megaships.svelte';
	import Mining from '$lib/components/mining.svelte';
	import Missions from '$lib/components/missions.svelte';
	import SearchRescue from '$lib/components/search-rescue.svelte';
	import Settlements from '$lib/components/settlements.svelte';

	function isAppActive(app: string) {
		return page.url.searchParams.get(app) === 'true';
	}
</script>

{#if isAppActive('combat')}<Combat />{/if}
{#if isAppActive('market-flood')}<MarketFlood />{/if}
{#if isAppActive('megaships')}<Megaships />{/if}
{#if isAppActive('mining')}<Mining />{/if}
{#if isAppActive('missions')}<Missions />{/if}
{#if isAppActive('search-rescue')}<SearchRescue />{/if}
{#if isAppActive('settlements')}<Settlements />{/if}
