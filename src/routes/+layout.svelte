<script lang="ts">
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
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<div class="navbar bg-base-100 shadow-sm">
		<a class="btn btn-ghost text-xl">daisyUI</a>
	</div>
	<main class="space-y-4 p-4">
		{@render children()}
	</main>
</div>
