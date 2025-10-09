<script lang="ts">
	import { Combobox } from 'bits-ui';

	import BaseSystem from 'lib/components/base-system.svelte';
	import IconAll from 'lib/icons/powerplay/all.svelte';
	import Acquisition from 'lib/icons/powerplay/acquisition.svelte';
	import Reinforcement from 'lib/icons/powerplay/reinforcement.svelte';
	import Undermining from 'lib/icons/powerplay/undermining.svelte';

	// TODO add helper text (e.g. Reformatory are excluded for lack of uplinks while Lowell-class have two)
	// TODO pagination
	// TODO call search when any of the parameters change and system is defined
	// TODO set API proxy for production
</script>

<div class="flex h-fit gap-2 pb-2">
	<ul class="menu gap-2">
		<li class="bg-primary text-primary-content">
			<a href="#all">
				<IconAll class="m-4 h-10 w-10" />
			</a>
		</li>
		<li class="bg-base-300">
			<a href="#acq">
				<Acquisition class="m-4 h-10 w-10" />
			</a>
		</li>
		<li class="bg-base-300">
			<a href="#rei">
				<Reinforcement class="m-4 h-10 w-10" />
			</a>
		</li>
		<li class="bg-base-300">
			<a href="#und">
				<Undermining class="m-4 h-10 w-10" />
			</a>
		</li>
	</ul>
	<div class="flex-1 pt-1">
		<div class="flex">
			<h2 class="text-accent-content flex-1 font-mono text-2xl">Megaships</h2>
			<BaseSystem class="w-fit" />
		</div>
		<table class="table border-separate border-spacing-y-3 pr-3">
			<thead class="relative font-mono text-xl">
				<tr
					class="after:bg-primary after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5"
				>
					<th class="p-0">Name</th>
					<th class="p-0">System</th>
					<th class="p-0 text-end">Distance</th>
				</tr>
			</thead>
			<tbody class="bg-base-200">
				<tr>
					<td class="border-r-base-100 border-r-6">HAX-1337 Freedom-class Surveyor</td>
					<td class="border-r-base-100 border-r-6">Raxxla</td>
					<td class="text-end">65.22ly</td>
				</tr>
				<tr>
					<td class="border-r-base-100 border-r-6">RAXXLA II Aquarius-class Tanker</td>
					<td class="border-r-base-100 border-r-6">HIP 42069</td>
					<td class="text-end">100.44ly</td>
				</tr>
				<tr>
					<td class="border-r-base-100 border-r-6">LCK-777 Gordon-class Hauler</td>
					<td class="border-r-base-100 border-r-6">Col 666 Sector WT-F c9-11</td>
					<td class="text-end">111.23ly</td>
				</tr>
				<tr>
					<td class="border-r-base-100 border-r-6">Amaethon Class Agricultural Vessel XYZ-351</td>
					<td class="border-r-base-100 border-r-6">Betta Pisces Aquarius</td>
					<td class="text-end">123.45ly</td>
				</tr>
				<tr>
					<td class="border-r-base-100 border-r-6">LTT 12345 Lowell-class Researcher</td>
					<td class="border-r-base-100 border-r-6">[REDACTED BY PILOTS FEDERATION]</td>
					<td class="text-end">189.43ly</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
