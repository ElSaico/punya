<script lang="ts">
	// Tailwind v4 has no present alternative to safelist, so all classes must be explicitly named
	const powers = [
		{ img: 'aisling.jpg', class: 'border-aisling text-aisling', name: 'Aisling Duval' },
		{ img: 'delaine.jpg', class: 'border-delaine text-delaine', name: 'Archon Delaine' },
		{
			img: 'arissa.jpg',
			class: 'border-arissa text-arissa',
			name: 'Arissa Lavigny\u{2011}Duval',
			option: 'A. Lavigny-Duval'
		},
		{ img: 'patreus.jpg', class: 'border-patreus text-patreus', name: 'Denton Patreus' },
		{ img: 'mahon.jpg', class: 'border-mahon text-mahon', name: 'Edmund Mahon' },
		{ img: 'winters.jpg', class: 'border-winters text-winters', name: 'Felicia Winters' },
		{ img: 'archer.jpg', class: 'border-archer text-archer', name: 'Jerome Archer' },
		{ img: 'li.jpg', class: 'border-li text-li', name: 'Li Yong\u{2011}Rui' },
		{ img: 'kaine.jpg', class: 'border-kaine text-kaine', name: 'Nakato Kaine' },
		{ img: 'antal.jpg', class: 'border-antal text-antal', name: 'Pranav Antal' },
		{ img: 'grom.jpg', class: 'border-grom text-grom', name: 'Yuri Grom' },
		{ img: 'torval.jpg', class: 'border-torval text-torval', name: 'Zemina Torval' }
	];
	// TODO store selected power (and assign opacity-100 to its respective button)
</script>

<div class="flex h-fit p-4">
	<div class="grid flex-1 grid-cols-3 gap-4 font-mono text-xl">
		{#each powers as power (power.img)}
			<button
				class={[
					'inset-shadow-pp flex cursor-pointer gap-4 rounded-xl border p-2 text-left opacity-50 hover:opacity-100',
					power.class
				]}
			>
				<img src="/images/{power.img}" alt={power.name} class="size-16" />
				<span class="my-auto [word-spacing:100vw]">{power.name}</span>
			</button>
		{/each}
	</div>
	<div class="divider divider-horizontal flex-shrink"></div>
	<div class="flex flex-1 flex-col">
		<span class="text-accent-content font-mono text-2xl">Punya</span>
		<span class="py-2">Select your power here</span>
		<span class="py-2">
			<a href="https://meritminer.cc" class="link link-primary">MeritMiner</a> to find mining rings
		</span>
		<span class="py-2">TODO: a proper intro text</span>
	</div>
</div>
