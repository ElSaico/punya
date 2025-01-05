<script lang="ts">
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
				{ link: '/bounties', label: 'Bounty hunting', icon: Siren },
				// Undermining origins only
				{ link: '/crimes', label: 'Crimes', icon: Columns4 },
				// target station needs power contact (unavailable on Anarchy)
				{ link: '/pods', label: 'Escape pods', icon: Refrigerator },
				// target station needs power contact (unavailable on Anarchy)
				// no Acquisition (or Anarchy, obviously) origins
				{ link: '/salvage', label: 'Salvage', icon: Trash2 },
				// Anarchy filter is useful
				{ link: '/power-kills', label: 'Power kills', icon: Crosshair },
				// non-dockable types only
				// does Spansh even list them?
				{ link: '/megaships', label: 'Megaships', icon: Rocket }
			]
		},
		{
			label: 'Stations',
			content: [
				// no Undermining origins
				{ link: '/restore', label: 'Restore/Reactivate missions', iconLab: toolbox },
				// Acquisition origins must be under conflict
				{ link: '/support', label: 'Support missions', icon: Gift },
				{ link: '/holoscreen', label: 'Holoscreen hacking', icon: Cast },
				// Reinforcement target must be on a different system
				{ link: '/power-commodities', label: 'Power commodities', icon: Package },
				// Acquisition conflict or Undermining targets only
				{ link: '/market-flood', label: 'Market flood', icon: BadgeCent },
				// no Undermining targets
				// Acquisition targets have (unknown?) location requirement
				{ link: '/high-profit', label: 'High-profit sales', icon: BadgeDollarSign },
				// targets have (unknown?) location requirement
				{ link: '/mining', label: 'Mining', icon: Gem },
				// no Undermining targets
				// must be legal on target
				{ link: '/rares', label: 'Rare goods', icon: ShoppingBasket }
			]
		},
		{
			label: 'Settlements',
			content: [
				// no Reinforcement origins
				{ link: '/power-goods', label: 'Power goods', iconLab: chest },
				// Odyssey settlements only
				// Reinforcement targets don't accept Research or Industrial
				// settlement economy influences type availability
				// Anarchy filter is useful
				{ link: '/power-data', label: 'Power data', icon: HardDriveDownload },
				// Odyssey settlements only
				// no Reinforcement origins
				{ link: '/power-malware', label: 'Power malware', icon: HardDriveUpload }
			]
		}
	];
</script>

<div data-sidebar="root">
	<div data-sidebar="header">
		<p class="text-2xl font-semibold tracking-tight">
			<a href="/">Punya</a>
		</p>
	</div>
	<div data-sidebar="content">
		{#each menu as group (group.label)}
			<div data-sidebar="group">
				<div data-sidebar="group-label">{group.label}</div>
				<div data-sidebar="group-content">
					<ul data-sidebar="menu">
						{#each group.content as item (item.label)}
							<!-- shadcn applies the following classes, but do we even need them? -->
							<li data-sidebar="menu-item" class="group/menu-item">
								<a href={item.link} data-sidebar="menu-button" class="peer/menu-button">
									{#if item.iconLab}
										<Icon iconNode={item.iconLab} />
									{:else if item.icon}
										<item.icon />
									{/if}
									<span>{item.label}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/each}
	</div>
	<div data-sidebar="footer"></div>
</div>
