import { z } from '@hono/zod-openapi';
import { index, integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const PowerEnum = z.enum([
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

export const systems = sqliteTable(
	'systems',
	{
		id64: integer().primaryKey(),
		name: text().notNull(),
		x: real().notNull(),
		y: real().notNull(),
		z: real().notNull(),
		power: text({ enum: PowerEnum.options })
	},
	(table) => [index('power_idx').on(table.power)]
);

export const megaships = sqliteTable('megaships', {
	name: text().primaryKey(),
	category: text(),
	shipClass: text(),
	codename: text(),
	timestamp: integer({ mode: 'timestamp_ms' }).notNull(),
	systemId: integer().notNull()
});

export const megashipRoutes = sqliteTable(
	'megaship_routes',
	{
		name: text().notNull(),
		timestamp: integer({ mode: 'timestamp_ms' }).notNull(),
		// we do not set an FK because the user's corresponding FSDJump might come afterwards
		systemId: integer().notNull()
	},
	(table) => [primaryKey({ columns: [table.name, table.timestamp] })]
);
