ALTER TABLE `chat_history` MODIFY COLUMN `user_id` varchar(255);--> statement-breakpoint
ALTER TABLE `counselor_profile` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `message` MODIFY COLUMN `sender_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `notification` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `referral` MODIFY COLUMN `referrer_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `referral` MODIFY COLUMN `referred_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `student_profile` MODIFY COLUMN `user_id` varchar(255) NOT NULL;