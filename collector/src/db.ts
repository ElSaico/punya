import 'dotenv/config';
import sql from 'mssql';

import { Power, PowerState, SystemPosition } from './eddn';

export interface MegashipInput {
  timestamp: Date;
  systemId: number;
  megaships: string[];
}

export interface System {
  id64: number;
  name: string;
  timestamp: Date;
  pos: SystemPosition;
  power?: Power;
  powerState?: PowerState;
}

export interface Megaship {
  name: string;
  category?: string;
  shipClass?: string; // could be turned into an enum in the future
  codename?: string;
  timestamp: Date;
  systemId: number;
}

type MegashipCategory =
  | 'Cropper'
  | 'Hauler'
  | 'Reformatory'
  | 'Researcher'
  | 'Surveyor'
  | 'Tanker'
  | 'Traveller';

// {codename} {class}-class {category}
const RE_SHIP_NEW = /^([A-Z\-.'+\d\s]+) ([A-Z][a-z]+)-class ([A-Z][a-z]+)$/;
// {class} Class {category} {codename}
const RE_SHIP_OLD = /^([A-Z][a-z]+) Class ([A-Za-z\s]+) ([A-Z]+-\d+)$/;
// old type -> new type
const MEGASHIP_CATEGORY_REMAP = new Map<string, MegashipCategory>([
  ['Agricultural Vessel', 'Cropper'],
  ['Cargo Ship', 'Hauler'], // only ALL-4659 according to Inara
  ['Bulk Cargo Ship', 'Hauler'],
  ['Prison Ship', 'Reformatory'],
  ['Science Vessel', 'Researcher'],
  ['Survey Vessel', 'Surveyor'],
  ['Tanker', 'Tanker'],
  ['Tourist Ship', 'Traveller']
]);

const QUERY_MEGASHIP = `
    INSERT INTO MegashipRoute
    SELECT name, timestamp, system_id FROM (
        MERGE INTO Megaship
        USING (
            VALUES (@name, @category, @shipClass, @codename, @timestamp, @systemId)
        ) AS Input(name, category, ship_class, codename, timestamp, system_id)
            ON Megaship.name = Input.name
        WHEN MATCHED AND Megaship.timestamp > Input.timestamp AND Megaship.system_id <> Input.system_id THEN
            UPDATE SET timestamp = Input.timestamp, system_id = Input.system_id
        WHEN NOT MATCHED THEN
            INSERT (name, category, ship_class, codename, timestamp, system_id)
            VALUES (name, category, ship_class, codename, timestamp, system_id)
        OUTPUT Inserted.name, Inserted.timestamp, Inserted.system_id 
    ) AS Changes(name, timestamp, system_id)
`;

const QUERY_SYSTEM = `
    MERGE INTO System
    USING (
        VALUES (@id64, @name, @timestamp, geometry::STGeomFromText(@pos, 0), @power, @powerState)
    ) AS Input(id64, name, timestamp, pos, power, power_state)
        ON System.id64 = Input.id64
    WHEN MATCHED AND System.timestamp > Input.timestamp
                 AND (System.power <> Input.power OR System.power_state <> Input.power_state) THEN
        UPDATE SET timestamp = Input.timestamp, power = Input.power, power_state = Input.power_state
    WHEN NOT MATCHED THEN
        INSERT (id64, name, timestamp, pos, power, power_state)
        VALUES (id64, name, timestamp, pos, power, power_state);
`;

export const pool = new sql.ConnectionPool(process.env.DATABASE_DSN!);

async function execPrepared(db: sql.ConnectionPool, fn: (request: sql.PreparedStatement) => void) {
  const t = db.transaction();
  await t.begin();
  const request = new sql.PreparedStatement(t);
  try {
    await fn(request);
    await request.unprepare();
    await t.commit();
  } catch (error) {
    console.error(error);
    await request.unprepare();
    await t.rollback();
  }
}

export async function createMegaships(db: sql.ConnectionPool, megaships: MegashipInput[]) {
  await execPrepared(db, async (request) => {
    request.input('name', sql.VarChar);
    request.input('category', sql.VarChar);
    request.input('shipClass', sql.VarChar);
    request.input('codename', sql.VarChar);
    request.input('timestamp', sql.DateTime);
    request.input('systemId', sql.BigInt);
    await request.prepare(QUERY_MEGASHIP);

    for (const signals of megaships) {
      for (const name of signals.megaships) {
        let _, category, shipClass, codename;
        if (RE_SHIP_NEW.test(name)) {
          [_, codename, shipClass, category] = name.match(RE_SHIP_NEW)!;
          codename = codename.trim();
        } else if (RE_SHIP_OLD.test(name)) {
          [_, shipClass, category, codename] = name.match(RE_SHIP_OLD)!;
          category = MEGASHIP_CATEGORY_REMAP.get(category.trim());
        }

        await request.execute({
          name,
          category,
          shipClass,
          codename,
          timestamp: signals.timestamp,
          systemId: signals.systemId
        });
      }
    }
  });
}

export async function createSystems(db: sql.ConnectionPool, systems: System[]) {
  await execPrepared(db, async (request) => {
    request.input('id64', sql.BigInt);
    request.input('name', sql.VarChar);
    request.input('timestamp', sql.DateTime);
    request.input('pos', sql.VarChar);
    request.input('power', sql.VarChar);
    request.input('powerState', sql.VarChar);
    await request.prepare(QUERY_SYSTEM);

    for (const system of systems) {
      await request.execute({
        id64: system.id64,
        name: system.name,
        timestamp: system.timestamp,
        pos: `POINT(${system.pos.join(' ')})`,
        power: system.power,
        powerState: system.powerState
      });
    }
  });
}
