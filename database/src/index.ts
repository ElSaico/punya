import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { getTableConfig } from 'drizzle-orm/sqlite-core';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { createMiddleware } from 'hono/factory';
import { logger } from 'hono/logger';
import { zValidator } from '@hono/zod-validator';
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

// {codename} {class}-class {category}
const RE_SHIP_NEW = /^([A-Z\-.'+\d\s]+) ([A-Z][a-z]+)-class ([A-Z][a-z]+)$/;
// {class} Class {category} {codename}
const RE_SHIP_OLD = /^([A-Z][a-z]+) Class ([A-Za-z\s]+) ([A-Z]+-\d+)$/;
// old type -> new type
const MEGASHIP_CATEGORY_REMAP = new Map<string, string>([
	['Agricultural Vessel', 'Cropper'],
	['Cargo Ship', 'Hauler'], // only ALL-4659 according to Inara
	['Bulk Cargo Ship', 'Hauler'],
	['Prison Ship', 'Reformatory'],
	['Science Vessel', 'Researcher'],
	['Survey Vessel', 'Surveyor'],
	['Tanker', 'Tanker'],
	['Tourist Ship', 'Traveller']
]);
const MEGASHIP_CHUNK_SIZE = Math.floor(100 / getTableConfig(megaships).columns.length);
const SYSTEM_CHUNK_SIZE = Math.floor(100 / getTableConfig(systems).columns.length);

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

const SystemCreate = z
	.object({
		id64: z.number().int().positive(),
		name: z.string(),
		x: z.number(),
		y: z.number(),
		z: z.number(),
		power: PowerEnum.optional()
	})
	.array()
	.nonempty();

const MegashipInput = z
	.object({
		timestamp: z.coerce.date(),
		systemId: z.number().int().positive(),
		megaships: z.string().array().nonempty()
	})
	.array()
	.nonempty();

const MegashipCreate = MegashipInput.transform((input) =>
	input.flatMap((signals) =>
		signals.megaships.map((name) => {
			let _, category, shipClass, codename;
			if (RE_SHIP_NEW.test(name)) {
				[_, codename, shipClass, category] = name.match(RE_SHIP_NEW)!;
				codename = codename.trim();
			} else if (RE_SHIP_OLD.test(name)) {
				[_, shipClass, category, codename] = name.match(RE_SHIP_OLD)!;
				category = MEGASHIP_CATEGORY_REMAP.get(category.trim());
			}
			return {
				name,
				category,
				shipClass,
				codename,
				timestamp: signals.timestamp,
				systemId: signals.systemId
			};
		})
	)
);

const app = new Hono<{ Bindings: Bindings }>();
const apiKey = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
	const auth = bearerAuth({ token: c.env.API_KEY });
	return auth(c, next);
});

/*
	D1 has a hard limit on bound parameters per query[1], thus we need to split our inserts in chunks
	as long as drizzle lacks a high-level abstraction for that[2]

	[1] https://developers.cloudflare.com/d1/platform/limits/

	[2] https://github.com/drizzle-team/drizzle-orm/issues/2479
 */
function chunkify<T>(data: T[], size: number) {
	return [...Array(Math.ceil(data.length / size))].map(() => data.splice(0, size));
}

/*
	a necessary kludge to make the type checker happy, as db.batch() expects a non-empty array[1]

	zod could enforce this up to the chunking stage, with .transform(), .coerce and .nonempty(),
	but that information would be lost after building the queries with Array.map() anyway[2]

	[1] https://github.com/drizzle-team/drizzle-orm/issues/1292

	[2] https://github.com/microsoft/TypeScript/issues/29841
 */
function isTuple<T>(array: T[]): array is [T, ...T[]] {
	return array.length > 0;
}

app.use('*', logger());

app.get('/', async (c) => {
	const db = drizzle(c.env.DB, { casing: 'snake_case' });
	// TODO accept power and reference system as parameters
	const entries = await db.select().from(megaships);
	return Response.json(entries);
});

app.post('/systems', apiKey, zValidator('json', SystemCreate), async (c) => {
	const db = drizzle(c.env.DB, { casing: 'snake_case' });
	const data = c.req.valid('json');

	const chunks = chunkify(data, SYSTEM_CHUNK_SIZE).map((chunk) =>
		db
			.insert(systems)
			.values(chunk)
			.onConflictDoUpdate({
				target: systems.id64,
				set: { power: sql`excluded.power` },
				setWhere: sql`power <> excluded.power`
			})
	);
	if (!isTuple(chunks)) {
		return Response.json('this should be impossible', { status: 500 });
	}
	await db.batch(chunks);
	return Response.json('OK');
});

app.post('/megaships', apiKey, zValidator('json', MegashipInput), async (c) => {
	const db = drizzle(c.env.DB, { casing: 'snake_case' });
	const data = MegashipCreate.parse(c.req.valid('json'));

	const chunks = chunkify(data, MEGASHIP_CHUNK_SIZE).map((chunk) =>
		db
			.insert(megaships)
			.values(chunk)
			.onConflictDoUpdate({
				target: megaships.name,
				set: { systemId: sql`excluded.system_id` },
				setWhere: sql`system_id <> excluded.system_id AND timestamp > excluded.timestamp`
			})
			.returning()
	);
	if (!isTuple(chunks)) {
		return Response.json('this should be impossible', { status: 500 });
	}
	const moved = await db.batch(chunks);

	const chunksMoved = moved
		.filter((chunk) => chunk.length > 0)
		.map((chunk) => db.insert(megashipRoutes).values(chunk));
	if (!isTuple(chunksMoved)) {
		return Response.json('this should be impossible', { status: 500 });
	}
	await db.batch(chunksMoved);

	return Response.json('OK');
});

export default app;
