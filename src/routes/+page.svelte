<script lang="ts">
	import { getUrlQuery } from '$lib/utils';

	import Combat from '$lib/components/combat.svelte';
	import MarketFlood from '$lib/components/market-flood.svelte';
	import Megaships from '$lib/components/megaships.svelte';
	import Mining from '$lib/components/mining.svelte';
	import Missions from '$lib/components/missions.svelte';
	import SearchRescue from '$lib/components/search-rescue.svelte';
	import Settlements from '$lib/components/settlements.svelte';
</script>

{#if getUrlQuery('cb') === '1'}<Combat />{/if}
{#if getUrlQuery('mf') === '1'}<MarketFlood />{/if}
{#if getUrlQuery('mg') === '1'}<Megaships />{/if}
{#if getUrlQuery('mn') === '1'}<Mining />{/if}
{#if getUrlQuery('ms') === '1'}<Missions />{/if}
{#if getUrlQuery('sr') === '1'}<SearchRescue />{/if}
{#if getUrlQuery('st') === '1'}<Settlements />{/if}
