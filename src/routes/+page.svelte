<script lang="ts">
	import { isUrlQuery } from '$lib/utils';

	import Combat from '$lib/components/combat.svelte';
	import MarketFlood from '$lib/components/market-flood.svelte';
	import Megaships from '$lib/components/megaships.svelte';
	import Mining from '$lib/components/mining.svelte';
	import Missions from '$lib/components/missions.svelte';
	import SearchRescue from '$lib/components/search-rescue.svelte';
	import Settlements from '$lib/components/settlements.svelte';
</script>

{#if isUrlQuery('cb')}<Combat />{/if}
{#if isUrlQuery('mf')}<MarketFlood />{/if}
{#if isUrlQuery('mg')}<Megaships />{/if}
{#if isUrlQuery('mn')}<Mining />{/if}
{#if isUrlQuery('ms')}<Missions />{/if}
{#if isUrlQuery('sr')}<SearchRescue />{/if}
{#if isUrlQuery('st')}<Settlements />{/if}
