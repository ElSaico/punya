import 'dotenv/config';
import zeromq from 'zeromq';
import zlib from 'zlib';

import type { FSDJump, FSSSignalDiscovered, Journal } from './eddn';

const EDDI_URL = 'tcp://eddn.edcd.io:9500';

const eddi = new zeromq.Subscriber();

eddi.connect(EDDI_URL);
eddi.subscribe('');
console.log('EDDI listener connected successfully');

for await (const [src] of eddi) {
	const event: Journal = JSON.parse(zlib.inflateSync(src).toString());

	// TODO drop legacy messages
	// TODO batch stuff
	switch (event.message.event) {
		case 'FSSSignalDiscovered': {
			const fss = event.message as FSSSignalDiscovered;
			const megaships = fss.signals
				.filter((signal) => signal.SignalType === 'Megaship')
				.map((signal) => signal.SignalName);

			if (megaships.length > 0) {
				const data = JSON.stringify({
					timestamp: fss.timestamp,
					systemId: fss.SystemAddress,
					megaships
				});
				await fetch(`${process.env.DATABASE_API_URL}/megaships`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${process.env.DATABASE_API_KEY}`
					},
					body: data
				}).then(async (response) => {
					if (!response.ok) {
						console.error(`[megaships] Status error: ${response.status}`);
						console.error(`[megaships] Input: ${data}`);
						console.error(`[megaships] Output: ${await response.text()}`);
					}
				});
			}
			break;
		}
		case 'FSDJump': {
			const fsd = event.message as FSDJump;
			const data = JSON.stringify({
				id64: fsd.SystemAddress,
				name: fsd.StarSystem,
				x: fsd.StarPos[0],
				y: fsd.StarPos[1],
				z: fsd.StarPos[2],
				power: fsd.ControllingPower
			});
			await fetch(`${process.env.DATABASE_API_URL}/systems`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.DATABASE_API_KEY}`
				},
				body: data
			}).then(async (response) => {
				if (!response.ok) {
					console.error(`[systems] Status error: ${response.status}`);
					console.error(`[systems] Input: ${data}`);
					console.error(`[systems] Output: ${await response.text()}`);
				}
			});
			break;
		}
	}
}
