ALTER TABLE `account` MODIFY COLUMN `access_token_expires_at` timestamp DEFAULT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `refresh_token_expires_at` timestamp DEFAULT NULL;