-- ============================================================
-- V7: Add Enterprise Status and Rejection Reason columns
-- MySQL 8.0+ | Waste Collection & Recycling Platform
-- ============================================================

-- Add new columns to enterprises table for status tracking and rejection reasons
ALTER TABLE `enterprises` 
ADD COLUMN `status` ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending' AFTER `is_verified`,
ADD COLUMN `rejection_reason` VARCHAR(500) NULL AFTER `status`,
ADD INDEX `idx_enterprises_status` (`status`);

-- Update existing verified enterprises to have 'Verified' status
UPDATE `enterprises` SET `status` = 'Verified' WHERE `is_verified` = 1;

-- Update existing unverified enterprises to have 'Pending' status (default is already set)
UPDATE `enterprises` SET `status` = 'Pending' WHERE `is_verified` = 0;
