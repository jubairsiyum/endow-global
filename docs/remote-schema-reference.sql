-- Remote Schema Reference — Hostinger MySQL (u523324533_egeneweb)
-- Introspected: 2026-06-09
-- Source: mysql://u523324533_egeneweb@srv1749.hstgr.io:3306/u523324533_egeneweb
-- 18 tables, 193 columns, 20 indexes, 2 foreign keys

-- ─── account ──────────────────────────────────────────────
-- Composite PK: (provider, providerAccountId)
-- FK: user_id -> user.id (ON DELETE CASCADE)
CREATE TABLE `account` (
  `id` varchar(255) NOT NULL,
  `provider_account_id` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `access_token` text,
  `refresh_token` text,
  `id_token` text,
  `expires_at` timestamp NULL,
  `refresh_expires_at` timestamp NULL,
  `scope` varchar(255),
  `password` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`provider`,`provider_account_id`),
  UNIQUE KEY `account_id_unique` (`id`),
  KEY `account_user_id_idx` (`user_id`)
);

-- ─── session ──────────────────────────────────────────────
-- Column: session_token (not token), expires (not expires_at)
-- FK: user_id -> user.id (ON DELETE CASCADE)
CREATE TABLE `session` (
  `id` varchar(255) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL,
  `ip_address` varchar(255),
  `user_agent` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_session_token_unique` (`session_token`),
  KEY `session_user_id_idx` (`user_id`)
);

-- ─── user ─────────────────────────────────────────────────
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255),
  `email` varchar(255) NOT NULL,
  `email_verified` tinyint NOT NULL DEFAULT 0,
  `image` varchar(255),
  `role` enum('STUDENT','COUNSELOR','ADMIN') NOT NULL DEFAULT 'STUDENT',
  `fcm_token` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_idx` (`email`),
  UNIQUE KEY `user_email_unique` (`email`)
);

-- ─── verification_token ───────────────────────────────────
CREATE TABLE `verification_token` (
  `id` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `identifier_idx` (`identifier`)
);

-- ─── student_profile ──────────────────────────────────────
CREATE TABLE `student_profile` (
  `id` varchar(25) NOT NULL,
  `user_id` varchar(25) NOT NULL,
  `target_countries` json DEFAULT ('[]'),
  `target_subjects` json DEFAULT ('[]'),
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
  `nationality` varchar(100),
  `highest_education` enum('HIGH_SCHOOL','BACHELORS','MASTERS','PHD') NOT NULL DEFAULT 'HIGH_SCHOOL',
  `work_experience_years` int NOT NULL DEFAULT 0,
  `assigned_counselor_id` varchar(25),
  `referral_code` varchar(25) NOT NULL,
  `referral_balance` int NOT NULL DEFAULT 0,
  `profile_embedding` json DEFAULT ('[]'),
  `matches_updated_at` datetime,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_profile_referral_code_unique` (`referral_code`),
  UNIQUE KEY `student_profile_user_id_unique` (`user_id`)
);

-- ─── counselor_profile ────────────────────────────────────
CREATE TABLE `counselor_profile` (
  `id` varchar(25) NOT NULL,
  `user_id` varchar(25) NOT NULL,
  `bio` text,
  `expertise_countries` json DEFAULT ('[]'),
  `expertise_subjects` json DEFAULT ('[]'),
  `languages` json DEFAULT (JSON_ARRAY('English')),
  `cal_username` varchar(255),
  `session_rate` int NOT NULL DEFAULT 0,
  `total_students` int NOT NULL DEFAULT 0,
  `rating` float,
  `is_available` tinyint NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `counselor_profile_user_id_unique` (`user_id`)
);

-- ─── university ───────────────────────────────────────────
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
  `is_active` tinyint NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `university_slug_unique` (`slug`)
);

-- ─── course ───────────────────────────────────────────────
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
  `requirements` json DEFAULT ('[]'),
  `has_scholarship` tinyint NOT NULL DEFAULT 0,
  `scholarship_details` text,
  `description` text NOT NULL,
  `is_active` tinyint NOT NULL DEFAULT 1,
  `vector_id` varchar(255),
  `typesense_id` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_slug_unique` (`slug`)
);

-- ─── application ──────────────────────────────────────────
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
  `documents_urls` json NOT NULL DEFAULT (JSON_ARRAY()),
  `submitted_at` datetime,
  `counselor_notes` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`)
);

-- ─── shortlisted_course ───────────────────────────────────
CREATE TABLE `shortlisted_course` (
  `id` varchar(25) NOT NULL,
  `student_id` varchar(25) NOT NULL,
  `course_id` varchar(25) NOT NULL,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_course` (`student_id`,`course_id`)
);

-- ─── match_result ─────────────────────────────────────────
CREATE TABLE `match_result` (
  `id` varchar(25) NOT NULL,
  `student_id` varchar(25) NOT NULL,
  `course_id` varchar(25) NOT NULL,
  `score` float NOT NULL,
  `match_reasons` json DEFAULT ('[]'),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_match_student_course` (`student_id`,`course_id`)
);

-- ─── booking_session ──────────────────────────────────────
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
  `reminder_sent` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`)
);

-- ─── conversation ─────────────────────────────────────────
CREATE TABLE `conversation` (
  `id` varchar(25) NOT NULL,
  `student_id` varchar(25) NOT NULL,
  `counselor_id` varchar(25) NOT NULL,
  `last_message_at` timestamp NOT NULL DEFAULT (now()),
  `last_message` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_counselor` (`student_id`,`counselor_id`)
);

-- ─── message ──────────────────────────────────────────────
CREATE TABLE `message` (
  `id` varchar(25) NOT NULL,
  `conversation_id` varchar(25) NOT NULL,
  `sender_id` varchar(25) NOT NULL,
  `content` text NOT NULL,
  `attachment_url` varchar(255),
  `attachment_type` varchar(50),
  `is_read` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
);

-- ─── notification ─────────────────────────────────────────
CREATE TABLE `notification` (
  `id` varchar(25) NOT NULL,
  `user_id` varchar(25) NOT NULL,
  `type` enum('SESSION_REMINDER','APPLICATION_UPDATE','NEW_MESSAGE','MATCH_READY','REFERRAL_EARNED','SYSTEM') NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `data` json,
  `is_read` tinyint NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
);

-- ─── referral ─────────────────────────────────────────────
CREATE TABLE `referral` (
  `id` varchar(25) NOT NULL,
  `referrer_id` varchar(25) NOT NULL,
  `referred_id` varchar(25) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `credit_amount` int NOT NULL DEFAULT 500,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `completed_at` datetime,
  PRIMARY KEY (`id`),
  UNIQUE KEY `referral_referred_id_unique` (`referred_id`)
);

-- ─── newsletter_subscriber ────────────────────────────────
CREATE TABLE `newsletter_subscriber` (
  `id` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255),
  `is_active` tinyint NOT NULL DEFAULT 1,
  `subscribed_at` timestamp NOT NULL DEFAULT (now()),
  `tags` json DEFAULT ('[]'),
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletter_subscriber_email_unique` (`email`)
);

-- ─── chat_history ─────────────────────────────────────────
CREATE TABLE `chat_history` (
  `id` varchar(25) NOT NULL,
  `user_id` varchar(25),
  `session_id` varchar(255) NOT NULL,
  `messages` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE now(),
  PRIMARY KEY (`id`)
);
