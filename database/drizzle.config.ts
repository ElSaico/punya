import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './migrations',
	schema: './src/schema.ts',
	casing: 'snake_case',
	dialect: 'sqlite',
	driver: 'd1-http'
});
