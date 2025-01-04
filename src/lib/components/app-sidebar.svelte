<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
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
		Package,
		Refrigerator,
		Rocket,
		ShoppingBasket,
		Siren,
		Trash2
	} from 'lucide-svelte';
	import { chest, toolbox } from '@lucide/lab';

	const menu = [
		// how do we categorize this?
		{
			label: 'Systems',
			content: [
				// Undermining origins must be Delaine
				{ link: '#', label: 'Bounty hunting', icon: Siren },
				// Undermining origins only
				{ link: '#', label: 'Crimes', icon: Columns4 },
				// target station needs power contact (unavailable on Anarchy)
				{ link: '#', label: 'Escape pods', icon: Refrigerator },
				// target station needs power contact (unavailable on Anarchy)
				// no Acquisition (or Anarchy, obviously) origins
				{ link: '#', label: 'Salvage', icon: Trash2 },
				// Anarchy filter is useful
				{ link: '#', label: 'Power kills', icon: Crosshair },
				// non-dockable types only
				// does Spansh even list them?
				{ link: '#', label: 'Megaships', icon: Rocket }
			]
		},
		{
			label: 'Stations',
			content: [
				// no Undermining origins
				{ link: '#', label: 'Restore/Reactivate', iconLab: toolbox },
				// Acquisition origins must be under conflict
				{ link: '#', label: 'Support', icon: Gift },
				{ link: '#', label: 'Holoscreen', icon: Cast },
				// Reinforcement target must be on a different system
				{ link: '#', label: 'Power commodities', icon: Package },
				// Acquisition conflict or Undermining targets only
				{ link: '#', label: 'Market flood', icon: BadgeCent },
				// no Undermining targets
				// Acquisition targets have (unknown?) location requirement
				{ link: '#', label: 'High-profit sales', icon: BadgeDollarSign },
				// targets have (unknown?) location requirement
				{ link: '#', label: 'Mining', icon: Gem },
				// no Undermining targets
				// must be legal on target
				{ link: '#', label: 'Rare goods', icon: ShoppingBasket }
			]
		},
		{
			label: 'Settlements',
			content: [
				// no Reinforcement origins
				{ link: '#', label: 'Power goods', iconLab: chest },
				// Odyssey settlements only
				// Reinforcement targets don't accept Research or Industrial
				// settlement economy influences type availability
				// Anarchy filter is useful
				{ link: '#', label: 'Power data', icon: HardDriveDownload },
				// Odyssey settlements only
				// no Reinforcement origins
				{ link: '#', label: 'Malware', icon: HardDriveUpload }
			]
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<p class="text-2xl font-semibold tracking-tight">Punya</p>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each menu as group (group.label)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.content as item (item.label)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.link} {...props}>
											{#if item.iconLab}
												<Icon iconNode={item.iconLab} />
											{:else if item.icon}
												<item.icon />
											{/if}
											<span>{item.label}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer />
</Sidebar.Root>
