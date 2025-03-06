import zeromq from 'zeromq';
import zlib from 'zlib';

import { createMegaships, createSystems, pool, MegashipInput, System } from './db';
import type { FSDJump, FSSSignalDiscovered, Journal } from './eddn';

const EDDI_URL = 'tcp://eddn.edcd.io:9500';
const BATCH_SIZE_MEGASHIPS = 20;
const BATCH_SIZE_SYSTEMS = 100;

pool.connect().then(async (db) => {
  const eddi = new zeromq.Subscriber();
  const megaships: MegashipInput[] = [];
  const systems: System[] = [];

  eddi.connect(EDDI_URL);
  eddi.subscribe('');
  console.log('EDDI listener connected successfully');

  for await (const [src] of eddi) {
    const event: Journal = JSON.parse(zlib.inflateSync(src).toString());

    // TODO drop legacy messages
    switch (event.message.event) {
      case 'FSSSignalDiscovered': {
        const fss = event.message as FSSSignalDiscovered;
        const signals = fss.signals
          .filter(
            (signal) =>
              signal.SignalType === 'Megaship' && signal.SignalName !== 'System Colonisation Ship'
          )
          .map((signal) => signal.SignalName);

        if (signals.length > 0) {
          megaships.push({
            timestamp: new Date(fss.timestamp),
            systemId: fss.SystemAddress,
            megaships: signals
          });
          if (megaships.length >= BATCH_SIZE_MEGASHIPS) {
            await createMegaships(db, megaships);
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
          timestamp: new Date(fsd.timestamp),
          pos: fsd.StarPos,
          power: fsd.ControllingPower,
          powerState: fsd.PowerplayState
        });
        if (systems.length >= BATCH_SIZE_SYSTEMS) {
          await createSystems(db, systems);
          systems.splice(0);
        }
        break;
      }
    }
  }
});
