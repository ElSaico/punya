import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { logger } from 'hono/logger';
import { z } from 'zod';

import { megashipRoutes, megaships, systems } from './schema';

/*
  TODO road to merits
  Antal = 900/uplink for Acquisition and Reinforcement, variable amount (but less) for Undermining
  Reformatory megaships are worthless, while the Lowell-class have two uplinks
  - are generation ships scannable? (probably not)
  - what about the undockable megaships with custom names (e.g. Legacy of Synteini)?
*/

type Bindings = {
	DB: D1Database;
	API_KEY: string;
};

const RE_SHIP_NEW = /^([A-Z\-.'+\d\s]+) ([A-Z][a-z]+)-class ([A-Z][a-z]+)$/;
const RE_SHIP_OLD = /^([A-Z][a-z]+) Class ([A-Za-z\s]+) ([A-Z]+-\d+)$/;
const MEGASHIP_CATEGORY_REMAP = new Map<string, string>([
	['Agricultural Vessel', 'Cropper'],
	['Bulk Cargo Ship', 'Hauler'],
	['Prison Ship', 'Reformatory'],
	['Science Vessel', 'Researcher'],
	['Survey Vessel', 'Surveyor'],
	['Tanker', 'Tanker'],
	['Tourist Ship', 'Traveller']
]);

const PowerEnum = z.enum([
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
]);

const SystemCreate = z.object({
	id64: z.number().int().positive(),
	name: z.string(),
	x: z.number(),
	y: z.number(),
	z: z.number(),
	power: PowerEnum.optional()
});

const MegashipInput = z.object({
	timestamp: z.date(),
	systemId: z.number().int().positive(),
	megaships: z.string().array()
});

const MegashipCreate = MegashipInput.transform((input) =>
	input.megaships.map((name) => {
		let _, category, shipClass, codename;
		if (RE_SHIP_NEW.test(name)) {
			// {codename} {class}-class {category}
			[_, codename, shipClass, category] = name.match(RE_SHIP_NEW)!;
			codename = codename.trim();
		} else if (RE_SHIP_OLD.test(name)) {
			// {class} Class {category} {codename}
			[_, shipClass, category, codename] = name.match(RE_SHIP_OLD)!;
			category = MEGASHIP_CATEGORY_REMAP.get(category.trim());
		}
		return { name, category, shipClass, codename, systemId: input.systemId };
	})
);

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger(), async (c, next) => {
	const auth = bearerAuth({ token: c.env.API_KEY });
	return auth(c, next);
});

app.post('/', async (c) => {
	const db = drizzle(c.env.DB, { casing: 'snake_case' });
	// TODO accept power and reference system as parameters
	const entries = await db.select().from(megaships);
	return Response.json(entries);
});

app.post('/systems', async (c) => {
	const db = drizzle(c.env.DB, { casing: 'snake_case' });
	// TODO bulk stuff
	const data = SystemCreate.parse(await c.req.json());
	await db
		.insert(systems)
		.values(data)
		.onConflictDoUpdate({
			target: systems.id64,
			set: { power: sql`excluded.power` },
			setWhere: sql`power <> excluded.power`
		});
	return Response.json('OK');
});

app.post('/megaships', async (c) => {
	const db = drizzle(c.env.DB, { casing: 'snake_case' });
	// TODO bulk stuff
	const data = MegashipInput.parse(await c.req.json());
	const moved = await db
		.insert(megaships)
		.values(MegashipCreate.parse(data))
		.onConflictDoUpdate({
			target: megaships.name,
			set: { systemId: sql`excluded.systemId` },
			setWhere: sql`systemId <> excluded.systemId`
		})
		.returning({ name: megaships.name });
	await db.insert(megashipRoutes).values(
		moved.map((entry) => ({
			name: entry.name,
			systemId: data.systemId,
			timestamp: data.timestamp
		}))
	);
	return Response.json('OK');
});

export default app;
