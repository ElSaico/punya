<script lang="ts">
	import { Combobox } from 'bits-ui';
	import type { ClassValue } from 'svelte/elements';

	const props: { class: ClassValue } = $props();
	let autocomplete: Autocomplete[] = $state([]);
</script>

<label
	class={[
		'input input-ghost font-mono focus-within:bg-transparent focus-within:outline-none',
		props.class
	]}
>
	<span class="text-secondary-content text-lg">Near star system</span>
	<Combobox.Root type="single">
		<Combobox.Input
			class="bg-secondary border-secondary text-secondary-content border-2 pl-2"
			oninput={async (e) => {
				const name = e.currentTarget.value;
				if (name.length > 0) {
					const systems = await fetch(`/api/autocomplete/systems?${new URLSearchParams({ name })}`);
					autocomplete = systems.ok ? await systems.json() : [];
				}
			}}
		/>
		<Combobox.Portal>
			<Combobox.Content>
				<Combobox.Viewport class="bg-secondary text-secondary-content px-4 font-mono">
					{#each autocomplete as system (system.value)}
						<Combobox.Item label={system.label} value={system.value.toString()}>
							{#snippet children({ highlighted })}
								<span class={{ 'bg-accent text-accent-content': highlighted }}>
									{system.label}
								</span>
							{/snippet}
						</Combobox.Item>
					{:else}
						No systems found
					{/each}
				</Combobox.Viewport>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</label>
