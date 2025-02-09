import 'dotenv/config';
import zeromq from 'zeromq';
import zlib from 'zlib';

import type { FSDJump, FSSSignalDiscovered, Journal } from './eddn';

const EDDI_URL = 'tcp://eddn.edcd.io:9500';
const BATCH_SIZE_MEGASHIPS = 20;
const BATCH_SIZE_SYSTEMS = 100;

const eddi = new zeromq.Subscriber();
const megaships = [];
const systems = [];

eddi.connect(EDDI_URL);
eddi.subscribe('');
console.log('EDDI listener connected successfully');

async function request(endpoint: string, data: object[]) {
	const body = JSON.stringify(data);
	await fetch(`${process.env.DATABASE_API_URL}/${endpoint}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.DATABASE_API_KEY}`
		},
		body
	}).then(async (response) => {
		if (!response.ok) {
			console.error(`[megaships] Status error: ${response.status}`);
			console.error(`[megaships] Input: ${body}`);
			console.error(`[megaships] Output: ${await response.text()}`);
		}
	});
}

for await (const [src] of eddi) {
	const event: Journal = JSON.parse(zlib.inflateSync(src).toString());

	// TODO drop legacy messages
	switch (event.message.event) {
		case 'FSSSignalDiscovered': {
			const fss = event.message as FSSSignalDiscovered;
			const signals = fss.signals
				.filter((signal) => signal.SignalType === 'Megaship')
				.map((signal) => signal.SignalName);

			if (signals.length > 0) {
				megaships.push({
					timestamp: fss.timestamp,
					systemId: fss.SystemAddress,
					megaships: signals
				});
				if (megaships.length >= BATCH_SIZE_MEGASHIPS) {
					await request('megaships', megaships);
					megaships.splice(0);
				}
			}
			break;
		}
		case 'FSDJump': {
			const fsd = event.message as FSDJump;
			systems.push({
				id64: fsd.SystemAddress,
				name: fsd.StarSystem,
				x: fsd.StarPos[0],
				y: fsd.StarPos[1],
				z: fsd.StarPos[2],
				power: fsd.ControllingPower
			});
			if (systems.length >= BATCH_SIZE_SYSTEMS) {
				await request('systems', systems);
				systems.splice(0);
			}
			break;
		}
	}
}
