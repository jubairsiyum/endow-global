CREATE TABLE `homepage_hero_image` (
	`id` varchar(25) NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`alt_text` varchar(255) NOT NULL DEFAULT 'Homepage hero image',
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `homepage_hero_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_homepage_hero_image_active_order` ON `homepage_hero_image` (`is_active`,`sort_order`);
--> statement-breakpoint
CREATE INDEX `idx_homepage_hero_image_created_at` ON `homepage_hero_image` (`created_at`);
