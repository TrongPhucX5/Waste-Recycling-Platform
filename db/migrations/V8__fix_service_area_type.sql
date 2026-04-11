-- ============================================================
-- V8: Change service_area from JSON to VARCHAR
-- MySQL 8.0+ | Waste Collection & Recycling Platform
-- ============================================================

-- Change service_area column from JSON to VARCHAR(500)
ALTER TABLE `enterprises` 
MODIFY COLUMN `service_area` VARCHAR(500) NULL;
