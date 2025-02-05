CREATE TABLE `megaship_routes` (
	`name` text NOT NULL,
	`timestamp` integer NOT NULL,
	`system_id` integer NOT NULL,
	PRIMARY KEY(`name`, `timestamp`)
);
--> statement-breakpoint
CREATE TABLE `megaships` (
	`name` text PRIMARY KEY NOT NULL,
	`category` text,
	`ship_class` text,
	`codename` text,
	`timestamp` integer NOT NULL,
	`system_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `systems` (
	`id64` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`x` real NOT NULL,
	`y` real NOT NULL,
	`z` real NOT NULL,
	`power` text
);
--> statement-breakpoint
CREATE INDEX `power_idx` ON `systems` (`power`);