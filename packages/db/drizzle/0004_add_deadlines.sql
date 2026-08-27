CREATE TABLE `deadline` (
	`id` varchar(25) NOT NULL,
	`student_id` varchar(25),
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('APPLICATION','DOCUMENT','VISA','SCHOLARSHIP','EXAM','OTHER') NOT NULL DEFAULT 'OTHER',
	`due_at` datetime NOT NULL,
	`related_university` varchar(255),
	`related_course` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`remind_days_before` int NOT NULL DEFAULT 7,
	`created_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deadline_id` PRIMARY KEY(`id`)
);
