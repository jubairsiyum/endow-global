CREATE TABLE `branch` (
	`id` varchar(36) NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`address` varchar(500),
	`phone` varchar(50),
	`email` varchar(255),
	`status` enum('ACTIVE','INACTIVE','SETUP','CLOSED') NOT NULL DEFAULT 'ACTIVE',
	`manager_name` varchar(255),
	`counselors` int DEFAULT 0,
	`applications` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branch_id` PRIMARY KEY(`id`),
	CONSTRAINT `branch_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `course_module` (
	`id` varchar(25) NOT NULL,
	`course_id` varchar(25) NOT NULL,
	`term` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('CORE','OPTIONAL') NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_module_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_intake` (
	`id` varchar(25) NOT NULL,
	`course_id` varchar(25) NOT NULL,
	`intake_date` datetime NOT NULL,
	`apply_by_date` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_intake_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_requirement` (
	`course_id` varchar(25) NOT NULL,
	`requirement_id` varchar(25) NOT NULL,
	`is_mandatory` boolean NOT NULL DEFAULT true,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `idx_cr_pk` UNIQUE(`course_id`,`requirement_id`)
);
--> statement-breakpoint
CREATE TABLE `related_course` (
	`id` varchar(25) NOT NULL,
	`course_id` varchar(25) NOT NULL,
	`related_course_id` varchar(25) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `related_course_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_rc_unique` UNIQUE(`course_id`,`related_course_id`)
);
--> statement-breakpoint
CREATE TABLE `requirement` (
	`id` varchar(25) NOT NULL,
	`type` enum('ACADEMIC','ENGLISH_LANGUAGE','IDENTITY','MEDICAL','PROFESSIONAL','OTHER') NOT NULL,
	`name` varchar(255) NOT NULL,
	`min_percentage` float,
	`description` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `requirement_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resource` (
	`id` varchar(25) NOT NULL,
	`type` enum('BLOG','FILE') NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`content` text,
	`cover_image` varchar(500),
	`category` varchar(100),
	`section` varchar(50),
	`tags` json NOT NULL DEFAULT ('[]'),
	`author` varchar(255),
	`file_url` varchar(500),
	`file_name` varchar(255),
	`mime_type` varchar(100),
	`file_size` int,
	`is_published` boolean NOT NULL DEFAULT false,
	`published_at` datetime,
	`deadline` datetime,
	`meta_title` varchar(255),
	`meta_description` text,
	`keywords` json NOT NULL DEFAULT ('[]'),
	`canonical_url` varchar(500),
	`og_image_url` varchar(500),
	`no_index` boolean NOT NULL DEFAULT false,
	`featured` boolean NOT NULL DEFAULT false,
	`view_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resource_id` PRIMARY KEY(`id`),
	CONSTRAINT `resource_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `student_document` (
	`id` varchar(25) NOT NULL,
	`student_id` varchar(25) NOT NULL,
	`application_id` varchar(25),
	`category` varchar(100) NOT NULL,
	`label` varchar(255) NOT NULL,
	`file_url` varchar(500),
	`file_name` varchar(255),
	`file_size` int,
	`status` enum('PENDING','UPLOADED','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
	`rejection_reason` text,
	`uploaded_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `student_inquiry` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(255),
	`surname` varchar(255) NOT NULL,
	`given_name` varchar(255) NOT NULL,
	`dob` varchar(50),
	`gender` varchar(20),
	`phone` varchar(50) NOT NULL,
	`whatsapp` varchar(50),
	`email` varchar(255) NOT NULL,
	`father_name` varchar(255),
	`mother_name` varchar(255),
	`hometown` varchar(255),
	`nationality` varchar(100),
	`address_line1` varchar(500),
	`address_line2` varchar(500),
	`city` varchar(100),
	`state` varchar(100),
	`zip_code` varchar(20),
	`country` varchar(100) NOT NULL,
	`applying_to` varchar(50),
	`ssc_year` varchar(10),
	`ssc_result` varchar(50),
	`hsc_year` varchar(10),
	`hsc_result` varchar(50),
	`bachelors_year` varchar(10),
	`bachelors_result` varchar(50),
	`masters_year` varchar(10),
	`masters_result` varchar(50),
	`target_country` varchar(100),
	`target_university` varchar(255),
	`reason_to_choose` text,
	`english_test` varchar(50),
	`ielts_score` varchar(10),
	`toefl_score` varchar(10),
	`sat_score` varchar(10),
	`topik_level` varchar(10),
	`heard_from` varchar(100),
	`referral_name` varchar(255),
	`ip_address` varchar(50),
	`submitted_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `student_inquiry_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `course` ADD `campus` varchar(255);--> statement-breakpoint
ALTER TABLE `course` ADD `mode_of_study` enum('FULL_TIME','PART_TIME','ONLINE','HYBRID') DEFAULT 'FULL_TIME';--> statement-breakpoint
ALTER TABLE `course` ADD `highlights` json DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE `course` ADD `professional_accreditation` text;--> statement-breakpoint
ALTER TABLE `course` ADD `offer_response_time` varchar(50);--> statement-breakpoint
ALTER TABLE `course` ADD `backlogs_accepted` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `course` ADD `gap_years_accepted` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `course` ADD `english_test_waiver` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `course` ADD `express_offer` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `course` ADD `application_fee` float;--> statement-breakpoint
ALTER TABLE `course` ADD `brochure_url` varchar(500);--> statement-breakpoint
ALTER TABLE `university` ADD `accreditation` text;--> statement-breakpoint
ALTER TABLE `university` ADD `rankings` json DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE `university` ADD `featured` boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_cm_course` ON `course_module` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_ci_course` ON `course_intake` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_ci_intake_date` ON `course_intake` (`intake_date`);--> statement-breakpoint
CREATE INDEX `idx_cr_course` ON `course_requirement` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_cr_requirement` ON `course_requirement` (`requirement_id`);--> statement-breakpoint
CREATE INDEX `idx_rc_course` ON `related_course` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_rc_related` ON `related_course` (`related_course_id`);--> statement-breakpoint
CREATE INDEX `idx_resource_type` ON `resource` (`type`);--> statement-breakpoint
CREATE INDEX `idx_resource_published_type` ON `resource` (`is_published`,`type`);--> statement-breakpoint
CREATE INDEX `idx_resource_section` ON `resource` (`section`);--> statement-breakpoint
CREATE INDEX `idx_sd_student` ON `student_document` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_sd_application` ON `student_document` (`application_id`);