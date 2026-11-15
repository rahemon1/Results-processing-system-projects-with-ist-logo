CREATE TABLE `portal_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`role` text NOT NULL,
	`student_id` text,
	`password_hash` text,
	`must_change` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_accounts_username_unique` ON `portal_accounts` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `portal_accounts_student_id_unique` ON `portal_accounts` (`student_id`);--> statement-breakpoint
CREATE TABLE `portal_login_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
