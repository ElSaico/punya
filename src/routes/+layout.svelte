<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main>
		<ModeWatcher />
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
