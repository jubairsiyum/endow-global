CREATE TABLE `event` (
	`id` varchar(25) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text,
	`cover_image` varchar(500),
	`category` enum('WEBINAR','WORKSHOP','FAIR','SEMINAR','DEADLINE','OTHER') NOT NULL DEFAULT 'OTHER',
	`event_date` datetime,
	`event_end_date` datetime,
	`location` varchar(255),
	`registration_url` varchar(500),
	`tags` json NOT NULL DEFAULT ('[]'),
	`author` varchar(255),
	`is_featured` boolean NOT NULL DEFAULT false,
	`is_published` boolean NOT NULL DEFAULT false,
	`published_at` datetime,
	`meta_title` varchar(255),
	`meta_description` text,
	`og_image_url` varchar(500),
	`view_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_id` PRIMARY KEY(`id`),
	CONSTRAINT `event_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `idx_event_slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `idx_event_published_featured` ON `event` (`is_published`,`is_featured`);--> statement-breakpoint
CREATE INDEX `idx_event_date` ON `event` (`event_date`);--> statement-breakpoint
CREATE INDEX `idx_event_published_date` ON `event` (`is_published`,`published_at`);