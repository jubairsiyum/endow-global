CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` varchar(255),
	`password` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`),
	CONSTRAINT `provider_account_idx` UNIQUE(`provider_id`,`account_id`)
);
--> statement-breakpoint
CREATE TABLE `application` (
	`id` varchar(25) NOT NULL,
	`student_id` varchar(25) NOT NULL,
	`course_id` varchar(25) NOT NULL,
	`counselor_id` varchar(25),
	`status` enum('DRAFT','IN_PROGRESS','SUBMITTED','UNDER_REVIEW','DOCUMENTS_REQUIRED','ACCEPTED','REJECTED','WAITLISTED','WITHDRAWN') NOT NULL DEFAULT 'DRAFT',
	`current_step` int NOT NULL DEFAULT 1,
	`total_steps` int NOT NULL DEFAULT 5,
	`personal_info` json,
	`academic_history` json,
	`personal_statement` text,
	`documents_urls` json NOT NULL DEFAULT ('[]'),
	`submitted_at` datetime,
	`counselor_notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `application_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_session` (
	`id` varchar(25) NOT NULL,
	`student_id` varchar(25) NOT NULL,
	`counselor_id` varchar(25) NOT NULL,
	`cal_booking_id` varchar(255),
	`scheduled_at` datetime NOT NULL,
	`duration` int NOT NULL DEFAULT 60,
	`status` enum('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW') NOT NULL DEFAULT 'SCHEDULED',
	`meeting_url` varchar(255),
	`notes` text,
	`student_rating` int,
	`amount_paid` int NOT NULL DEFAULT 0,
	`stripe_payment_id` varchar(255),
	`reminder_sent` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booking_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_history` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25),
	`session_id` varchar(255) NOT NULL,
	`messages` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversation` (
	`id` varchar(25) NOT NULL,
	`student_id` varchar(25) NOT NULL,
	`counselor_id` varchar(25) NOT NULL,
	`last_message_at` timestamp NOT NULL DEFAULT (now()),
	`last_message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversation_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_student_counselor` UNIQUE(`student_id`,`counselor_id`)
);
--> statement-breakpoint
CREATE TABLE `counselor_profile` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`bio` text,
	`expertise_countries` json NOT NULL DEFAULT ('[]'),
	`expertise_subjects` json NOT NULL DEFAULT ('[]'),
	`languages` json NOT NULL DEFAULT ('["English"]'),
	`cal_username` varchar(255),
	`session_rate` int NOT NULL DEFAULT 0,
	`total_students` int NOT NULL DEFAULT 0,
	`rating` float,
	`is_available` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `counselor_profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `counselor_profile_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `course` (
	`id` varchar(25) NOT NULL,
	`university_id` varchar(25) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`level` enum('UNDERGRADUATE','POSTGRADUATE','PHD','DIPLOMA','CERTIFICATE','FOUNDATION') NOT NULL,
	`duration` int NOT NULL,
	`duration_unit` varchar(10) NOT NULL DEFAULT 'YEARS',
	`tuition_fee` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`application_deadline` datetime,
	`start_date` datetime,
	`language` varchar(50) NOT NULL DEFAULT 'English',
	`requirements` json NOT NULL DEFAULT ('[]'),
	`has_scholarship` boolean NOT NULL DEFAULT false,
	`scholarship_details` text,
	`description` text NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`vector_id` varchar(255),
	`typesense_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `match_result` (
	`id` varchar(25) NOT NULL,
	`student_id` varchar(25) NOT NULL,
	`course_id` varchar(25) NOT NULL,
	`score` float NOT NULL,
	`match_reasons` json NOT NULL DEFAULT ('[]'),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `match_result_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_match_student_course` UNIQUE(`student_id`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` varchar(25) NOT NULL,
	`conversation_id` varchar(25) NOT NULL,
	`sender_id` varchar(25) NOT NULL,
	`content` text NOT NULL,
	`attachment_url` varchar(255),
	`attachment_type` varchar(50),
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `message_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscriber` (
	`id` varchar(25) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`subscribed_at` timestamp NOT NULL DEFAULT (now()),
	`tags` json NOT NULL DEFAULT ('[]'),
	CONSTRAINT `newsletter_subscriber_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscriber_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`type` enum('SESSION_REMINDER','APPLICATION_UPDATE','NEW_MESSAGE','MATCH_READY','REFERRAL_EARNED','SYSTEM') NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`data` json,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referral` (
	`id` varchar(25) NOT NULL,
	`referrer_id` varchar(25) NOT NULL,
	`referred_id` varchar(25) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'PENDING',
	`credit_amount` int NOT NULL DEFAULT 500,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` datetime,
	CONSTRAINT `referral_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_referred_id_unique` UNIQUE(`referred_id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`ip_address` varchar(255),
	`user_agent` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `shortlisted_course` (
	`id` varchar(25) NOT NULL,
	`student_id` varchar(25) NOT NULL,
	`course_id` varchar(25) NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shortlisted_course_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_student_course` UNIQUE(`student_id`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `student_profile` (
	`id` varchar(25) NOT NULL,
	`user_id` varchar(25) NOT NULL,
	`phone` varchar(50),
	`nationality` varchar(100),
	`country_of_residence` varchar(100),
	`target_countries` json NOT NULL DEFAULT ('[]'),
	`target_subjects` json NOT NULL DEFAULT ('[]'),
	`budget_min` int,
	`budget_max` int,
	`gpa` float,
	`ielts_score` float,
	`toefl_score` int,
	`sat_score` int,
	`gre_score` int,
	`completion_percent` int NOT NULL DEFAULT 0,
	`preferred_intake_month` varchar(50),
	`preferred_intake_year` int,
	`highest_education` enum('HIGH_SCHOOL','BACHELORS','MASTERS','PHD') NOT NULL DEFAULT 'HIGH_SCHOOL',
	`work_experience_years` int NOT NULL DEFAULT 0,
	`assigned_counselor_id` varchar(25),
	`referral_code` varchar(25) NOT NULL,
	`referral_balance` int NOT NULL DEFAULT 0,
	`profile_embedding` json NOT NULL DEFAULT ('[]'),
	`matches_updated_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_profile_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `student_profile_referral_code_unique` UNIQUE(`referral_code`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` varchar(25) NOT NULL,
	`name` varchar(255) NOT NULL,
	`program` varchar(255) NOT NULL,
	`university` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`quote` text NOT NULL,
	`rating` int NOT NULL DEFAULT 5,
	`initials` varchar(4) NOT NULL,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `university` (
	`id` varchar(25) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`logo` varchar(255),
	`cover_image` varchar(255),
	`description` text NOT NULL,
	`ranking` int,
	`website` varchar(255),
	`established` int,
	`total_students` int,
	`international_percent` float,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `university_id` PRIMARY KEY(`id`),
	CONSTRAINT `university_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` varchar(255),
	`role` enum('STUDENT','COUNSELOR','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'STUDENT',
	`fcm_token` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`),
	CONSTRAINT `verification_identifier_unique` UNIQUE(`identifier`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`university_id` int unsigned NOT NULL,
	`department_id` int unsigned,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`level` enum('certificate','diploma','associate','bachelor','postgraduate_diploma','master','phd','professional') NOT NULL,
	`mode` enum('on_campus','online','hybrid','distance') NOT NULL DEFAULT 'on_campus',
	`duration_months` smallint unsigned NOT NULL,
	`intake_months` json,
	`tuition_fee` decimal(12,2) NOT NULL,
	`currency_code` char(3) NOT NULL DEFAULT 'USD',
	`application_fee` decimal(10,2) DEFAULT 0,
	`living_cost_est` decimal(12,2),
	`scholarship_available` boolean NOT NULL DEFAULT false,
	`scholarship_details` text,
	`total_seats` smallint unsigned,
	`min_gpa` decimal(4,2),
	`min_gpa_scale` decimal(4,2) DEFAULT 4,
	`work_exp_years` tinyint unsigned DEFAULT 0,
	`gmat_min` smallint unsigned,
	`gre_min` smallint unsigned,
	`english_test` json,
	`ielts_min` decimal(3,1),
	`toefl_min` smallint unsigned,
	`pte_min` smallint unsigned,
	`duolingo_min` smallint unsigned,
	`english_waiver_countries` json,
	`description` text,
	`curriculum_outline` text,
	`career_prospects` text,
	`specializations` json,
	`external_id` varchar(100),
	`course_code` varchar(50),
	`meta_title` varchar(255),
	`meta_description` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`view_count` int unsigned NOT NULL DEFAULT 0,
	`shortlist_count` int unsigned NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_catalog_courses_slug_university` UNIQUE(`slug`,`university_id`)
);
--> statement-breakpoint
CREATE TABLE `universities` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`country_code` char(2) NOT NULL,
	`city` varchar(100),
	`logo_url` varchar(512),
	`banner_url` varchar(512),
	`description` text,
	`established_year` smallint unsigned,
	`type` enum('public','private','research','technical','liberal_arts') DEFAULT 'public',
	`ranking_qs` float unsigned,
	`ranking_the` float unsigned,
	`ranking_national` float unsigned,
	`tuition_min` decimal(12,2),
	`tuition_max` decimal(12,2),
	`currency_code` char(3) NOT NULL DEFAULT 'USD',
	`campus_count` tinyint unsigned DEFAULT 1,
	`website_url` varchar(512),
	`accreditation` varchar(512),
	`is_active` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `universities_id` PRIMARY KEY(`id`),
	CONSTRAINT `universities_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `idx_catalog_universities_slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`code` char(2) NOT NULL,
	`name` varchar(100) NOT NULL,
	`flag_url` varchar(255),
	`continent` varchar(50),
	CONSTRAINT `countries_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `course_intakes` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`course_id` int unsigned NOT NULL,
	`intake_date` date NOT NULL,
	`available_seats` smallint unsigned,
	`application_deadline` date,
	`document_deadline` date,
	`status` enum('open','closed','waitlist','upcoming') NOT NULL DEFAULT 'upcoming',
	CONSTRAINT `course_intakes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_media` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`course_id` int unsigned NOT NULL,
	`media_type` enum('image','video','brochure','virtual_tour') NOT NULL,
	`url` varchar(512) NOT NULL,
	`title` varchar(255),
	`is_primary` boolean NOT NULL DEFAULT false,
	`sort_order` tinyint unsigned DEFAULT 0,
	CONSTRAINT `course_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_requirements` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`course_id` int unsigned NOT NULL,
	`doc_type` enum('transcript','degree_certificate','english_test_score','passport_copy','cv_resume','statement_of_purpose','recommendation_letter','bank_statement','portfolio','work_experience_letter','gmat_gre_score','other') NOT NULL,
	`is_mandatory` boolean NOT NULL DEFAULT true,
	`description` text,
	`notes` varchar(512),
	`sort_order` tinyint unsigned DEFAULT 0,
	CONSTRAINT `course_requirements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_reviews` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`course_id` int unsigned NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`rating` tinyint unsigned NOT NULL,
	`title` varchar(255),
	`body` text,
	`pros` text,
	`cons` text,
	`is_verified` boolean NOT NULL DEFAULT false,
	`is_published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_tags` (
	`course_id` int unsigned NOT NULL,
	`tag_id` int unsigned NOT NULL,
	CONSTRAINT `course_tags_course_id_tag_id_pk` PRIMARY KEY(`course_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `course_views` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`course_id` int unsigned NOT NULL,
	`user_id` varchar(255),
	`session_id` varchar(128),
	`viewed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`code` char(3) NOT NULL,
	`symbol` varchar(10) NOT NULL,
	`usd_rate` decimal(12,6) NOT NULL DEFAULT 1,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `currencies_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`university_id` int unsigned NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(20),
	`description` text,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scholarships` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`university_id` int unsigned,
	`course_id` int unsigned,
	`name` varchar(255) NOT NULL,
	`description` text,
	`amount` decimal(12,2),
	`currency_code` char(3) NOT NULL DEFAULT 'USD',
	`coverage_type` enum('full','partial','tuition_only','living_only') DEFAULT 'partial',
	`eligibility` text,
	`deadline` date,
	`link_url` varchar(512),
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `scholarships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`category` enum('subject','career','skill','certification','special') DEFAULT 'subject',
	`icon_url` varchar(255),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `university_rankings` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`university_id` int unsigned NOT NULL,
	`source` enum('QS','THE','ARWU','US_NEWS','national') NOT NULL,
	`subject_area` varchar(100),
	`rank_position` smallint unsigned NOT NULL,
	`rank_year` smallint unsigned NOT NULL,
	CONSTRAINT `university_rankings_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_university_rankings_unique` UNIQUE(`university_id`,`source`,`subject_area`,`rank_year`)
);
--> statement-breakpoint
CREATE TABLE `user_comparisons` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`course_id` int unsigned NOT NULL,
	`added_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_comparisons_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_user_comparisons_user_course` UNIQUE(`user_id`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `user_shortlists` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`course_id` int unsigned NOT NULL,
	`status` enum('saved','interested','applying','applied','offer_received','enrolled','rejected','withdrawn') NOT NULL DEFAULT 'saved',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_shortlists_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_user_shortlists_user_course` UNIQUE(`user_id`,`course_id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_university_id_universities_id_fk` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_currency_code_currencies_code_fk` FOREIGN KEY (`currency_code`) REFERENCES `currencies`(`code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `universities` ADD CONSTRAINT `universities_country_code_countries_code_fk` FOREIGN KEY (`country_code`) REFERENCES `countries`(`code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `universities` ADD CONSTRAINT `universities_currency_code_currencies_code_fk` FOREIGN KEY (`currency_code`) REFERENCES `currencies`(`code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_intakes` ADD CONSTRAINT `course_intakes_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_media` ADD CONSTRAINT `course_media_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_requirements` ADD CONSTRAINT `course_requirements_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_reviews` ADD CONSTRAINT `course_reviews_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_reviews` ADD CONSTRAINT `course_reviews_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_tags` ADD CONSTRAINT `course_tags_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_tags` ADD CONSTRAINT `course_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_views` ADD CONSTRAINT `course_views_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_views` ADD CONSTRAINT `course_views_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departments` ADD CONSTRAINT `departments_university_id_universities_id_fk` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scholarships` ADD CONSTRAINT `scholarships_university_id_universities_id_fk` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scholarships` ADD CONSTRAINT `scholarships_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scholarships` ADD CONSTRAINT `scholarships_currency_code_currencies_code_fk` FOREIGN KEY (`currency_code`) REFERENCES `currencies`(`code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `university_rankings` ADD CONSTRAINT `university_rankings_university_id_universities_id_fk` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_comparisons` ADD CONSTRAINT `user_comparisons_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_comparisons` ADD CONSTRAINT `user_comparisons_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_shortlists` ADD CONSTRAINT `user_shortlists_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_shortlists` ADD CONSTRAINT `user_shortlists_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_courses_is_active` ON `course` (`is_active`);--> statement-breakpoint
CREATE INDEX `idx_courses_subject` ON `course` (`subject`);--> statement-breakpoint
CREATE INDEX `idx_courses_level` ON `course` (`level`);--> statement-breakpoint
CREATE INDEX `idx_courses_has_scholarship` ON `course` (`has_scholarship`);--> statement-breakpoint
CREATE INDEX `idx_courses_university` ON `course` (`university_id`);--> statement-breakpoint
CREATE INDEX `idx_courses_created_at` ON `course` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_courses_active_subject` ON `course` (`is_active`,`subject`);--> statement-breakpoint
CREATE INDEX `idx_courses_active_level` ON `course` (`is_active`,`level`);--> statement-breakpoint
CREATE INDEX `idx_catalog_courses_university` ON `courses` (`university_id`);--> statement-breakpoint
CREATE INDEX `idx_catalog_courses_department` ON `courses` (`department_id`);--> statement-breakpoint
CREATE INDEX `idx_catalog_courses_level` ON `courses` (`level`);--> statement-breakpoint
CREATE INDEX `idx_catalog_courses_mode` ON `courses` (`mode`);--> statement-breakpoint
CREATE INDEX `idx_catalog_courses_tuition` ON `courses` (`tuition_fee`,`currency_code`);--> statement-breakpoint
CREATE INDEX `idx_catalog_courses_active_featured` ON `courses` (`is_active`,`is_featured`);--> statement-breakpoint
CREATE INDEX `idx_catalog_universities_country` ON `universities` (`country_code`);--> statement-breakpoint
CREATE INDEX `idx_catalog_universities_featured` ON `universities` (`is_featured`,`is_active`);--> statement-breakpoint
CREATE INDEX `idx_course_intakes_course` ON `course_intakes` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_course_intakes_date` ON `course_intakes` (`intake_date`);--> statement-breakpoint
CREATE INDEX `idx_course_media_course` ON `course_media` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_course_requirements_course` ON `course_requirements` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_course_reviews_course` ON `course_reviews` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_course_reviews_user` ON `course_reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_course_reviews_published` ON `course_reviews` (`is_published`);--> statement-breakpoint
CREATE INDEX `idx_course_views_course` ON `course_views` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_course_views_user` ON `course_views` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_course_views_viewed_at` ON `course_views` (`viewed_at`);--> statement-breakpoint
CREATE INDEX `idx_departments_university` ON `departments` (`university_id`);--> statement-breakpoint
CREATE INDEX `idx_scholarships_university` ON `scholarships` (`university_id`);--> statement-breakpoint
CREATE INDEX `idx_scholarships_course` ON `scholarships` (`course_id`);--> statement-breakpoint
CREATE INDEX `idx_user_comparisons_user` ON `user_comparisons` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_shortlists_user` ON `user_shortlists` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_shortlists_course` ON `user_shortlists` (`course_id`);