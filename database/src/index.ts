import { and, eq, isNotNull, like, ne, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { logger } from 'hono/logger';
import { createRoute, z, OpenAPIHono } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';

import feedApp from './feed';
import { megaships, PowerEnum, systems } from './schema';

/*
  TODO road to merits
  Antal = 900/uplink for Acquisition and Reinforcement, variable amount (but less) for Undermining
  Reformatory megaships are worthless, while the Lowell-class have two uplinks
  - are generation ships scannable? (probably not)
  - what about the undockable megaships with custom names (e.g. Legacy of Synteini)?
*/

const PowerSchema = PowerEnum.openapi('Power');
const PowerSystemKindSchema = z.enum(['all', 'acq', 'rei', 'und']).openapi('PowerSystemKind');

const MegashipResponseSchema = z
	.object({
		name: z.string(),
		category: z.string(),
		shipClass: z.string(),
		codename: z.string(),
		system: z.object({
			id64: z.number(),
			name: z.string(),
			power: PowerSchema.nullable()
		})
	})
	.openapi('Megaship');

const MegashipRequestSchema = z.object({
	power: PowerSchema,
	systemKind: PowerSystemKindSchema,
	baseSystemId: z.coerce.number().positive(),
	page: z.coerce.number().positive().default(10),
	offset: z.coerce.number().nonnegative().default(0)
});

const AutocompleteResponseSchema = z
	.object({
		label: z.string(),
		value: z.coerce.number()
	})
	.array()
	.openapi('Autocomplete');

const app = new OpenAPIHono<{ Bindings: Env }>();

app.use('*', logger());

app.openapi(
	createRoute({
		method: 'get',
		path: '/megaships',
		request: {
			query: MegashipRequestSchema
		},
		middleware: [zValidator('query', MegashipRequestSchema)],
		responses: {
			200: {
				description: 'Retrieve a list of megaships',
				content: {
					'application/json': {
						schema: MegashipResponseSchema.array()
					}
				}
			}
		}
	}),
	async (c) => {
		const db = drizzle(c.env.DB, { casing: 'snake_case' });
		const data = c.req.valid('query');

		// TODO distance from base system
		// TODO filter by power+kind
		const entries = await db
			.select({
				name: megaships.name,
				// workaround to https://github.com/drizzle-team/drizzle-orm/issues/2956
				codename: sql<string>`codename`,
				shipClass: sql<string>`ship_class`,
				category: sql<string>`category`,
				system: {
					id64: systems.id64,
					name: systems.name,
					power: systems.power
				}
			})
			.from(megaships)
			.innerJoin(systems, eq(megaships.systemId, systems.id64))
			.where(
				and(
					ne(megaships.category, 'Reformatory'),
					isNotNull(megaships.codename),
					isNotNull(megaships.shipClass),
					isNotNull(megaships.category)
				)
			)
			.limit(data.page)
			.offset(data.offset);
		return c.json(entries, 200);
	}
);

app.openapi(
	createRoute({
		method: 'get',
		path: '/autocomplete/systems',
		request: {
			query: z.object({
				name: z.string()
			})
		},
		responses: {
			200: {
				description: 'Searches for a system name',
				content: {
					'application/json': {
						schema: AutocompleteResponseSchema
					}
				}
			}
		}
	}),
	async (c) => {
		const db = drizzle(c.env.DB, { casing: 'snake_case', logger: true });
		const data = c.req.valid('query');

		const entries = await db
			.select({ label: systems.name, value: systems.id64 })
			.from(systems)
			.where(like(systems.name, `${data.name}%`))
			.orderBy(systems.name)
			.limit(10);
		return c.json(entries, 200);
	}
);

app.doc31('/docs', { openapi: '3.1.0', info: { title: 'Punya API', version: '1' } });

app.route('/feed', feedApp);

export default app;
