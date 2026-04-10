-- ============================================================
-- V7: Create notifications table
-- ============================================================
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `notifications` (
    `id`                CHAR(36)     NOT NULL DEFAULT (UUID()),
    `user_id`           CHAR(36)     NOT NULL,
    `title`             VARCHAR(255) NOT NULL,
    `message`           TEXT         NOT NULL,
    `type`              INT          NOT NULL,
    `related_entity_id` CHAR(36)     NULL,
    `is_read`           TINYINT(1)   NOT NULL DEFAULT 0,
    `created_at`        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_notifications_user_id_created` ON `notifications` (`user_id`, `created_at` DESC);
