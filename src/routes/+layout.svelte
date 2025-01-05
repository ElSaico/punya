<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<div class="group/sidebar-wrapper has-[[data-variant=inset]]:bg-sidebar flex min-h-svh w-full">
	<AppSidebar />
	<main>
		<ModeWatcher />
		{@render children?.()}
	</main>
</div>
