-- ============================================================
-- V7: Leaderboard Test Data
-- 
-- Thêm dữ liệu test đầy đủ để kiểm tra bảng xếp hạng
-- 
-- 1. Reward Rules - định nghĩa điểm thưởng cho từng loại rác
-- 2. Citizens bổ sung từ nhiều khu vực (District)
-- 3. Reward Points chi tiết cho mỗi citizen
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

USE WastePlatformDB;

-- ============================================================
-- PHẦN 1: REWARD RULES - Định nghĩa điểm thưởng
-- ============================================================
-- Reward rules cho Enterprise 1 (Green Life)
INSERT INTO reward_rules (id, enterprise_id, waste_category_id, points_per_report, bonus_quality, is_active)
VALUES 
  (UUID(), 'ee1ee1ee-1ee1-1ee1-1ee1-1ee1ee1ee1ee', 1, 15, 5, 1),  -- Nhựa: 15 điểm + 5 bonus
  (UUID(), 'ee1ee1ee-1ee1-1ee1-1ee1-1ee1ee1ee1ee', 3, 20, 8, 1);  -- Giấy: 20 điểm + 8 bonus

-- Reward rules cho Enterprise 2 (Eco-Friendly)
INSERT INTO reward_rules (id, enterprise_id, waste_category_id, points_per_report, bonus_quality, is_active)
VALUES 
  (UUID(), 'ee2ee2ee-2ee2-2ee2-2ee2-2ee2ee2ee2ee', 2, 25, 10, 1), -- Thực phẩm: 25 điểm + 10 bonus
  (UUID(), 'ee2ee2ee-2ee2-2ee2-2ee2-2ee2ee2ee2ee', 1, 15, 5, 1);  -- Nhựa: 15 điểm + 5 bonus

-- Reward rules cho Enterprise 3 (Urban Waste) - nếu tồn tại
INSERT INTO reward_rules (id, enterprise_id, waste_category_id, points_per_report, bonus_quality, is_active)
VALUES 
  (UUID(), 'ee3ee3ee-3ee3-3ee3-3ee3-3ee3ee3ee3ee', 1, 18, 7, 1),  -- Nhựa: 18 điểm + 7 bonus
  (UUID(), 'ee3ee3ee-3ee3-3ee3-3ee3-3ee3ee3ee3ee', 4, 22, 9, 1);  -- Kim loại: 22 điểm + 9 bonus

-- ============================================================
-- PHẦN 2: THÊM CITIZENS BỔ SUNG TỪ NHIỀU KHU VỰC
-- ============================================================
-- Citizens Q1 (Quận 1)
INSERT INTO users (id, email, password_hash, full_name, phone, role, district, ward, is_active, created_at)
VALUES 
  ('c1111111-1111-1111-1111-111111111111', 'nguyen.d@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Nguyễn Đức Anh', '0901111111', 'Citizen', 'Quận 1', 'Phường Bến Nghé', 1, NOW()),
  ('c1111112-1111-1111-1111-111111111111', 'tran.k@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Trần Kỳ Linh', '0901111112', 'Citizen', 'Quận 1', 'Phường Nguyễn Cư Trinh', 1, NOW()),
  ('c1111113-1111-1111-1111-111111111111', 'pham.m@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Phạm Minh Tuấn', '0901111113', 'Citizen', 'Quận 1', 'Phường Đa Kao', 1, NOW()),
  ('c1111114-1111-1111-1111-111111111111', 'le.h@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Lê Hoàng Phú', '0901111114', 'Citizen', 'Quận 1', 'Phường Tân Định', 1, NOW());

-- Citizens Q3 (Quận 3)
INSERT INTO users (id, email, password_hash, full_name, phone, role, district, ward, is_active, created_at)
VALUES 
  ('c3333331-3333-3333-3333-333333333333', 'vu.q@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Vũ Quốc Hưng', '0903333331', 'Citizen', 'Quận 3', 'Phường Võ Thị Sáu', 1, NOW()),
  ('c3333332-3333-3333-3333-333333333333', 'dang.l@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Đặng Linh Chi', '0903333332', 'Citizen', 'Quận 3', 'Phường 6', 1, NOW()),
  ('c3333333-3333-3333-3333-333333333333', 'hoang.t@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Hoàng Thảo Nhi', '0903333333', 'Citizen', 'Quận 3', 'Phường 8', 1, NOW()),
  ('c3333334-3333-3333-3333-333333333333', 'ta.n@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Tạ Nhân Bảo', '0903333334', 'Citizen', 'Quận 3', 'Phường 10', 1, NOW());

-- Citizens Bình Thạnh
INSERT INTO users (id, email, password_hash, full_name, phone, role, district, ward, is_active, created_at)
VALUES 
  ('cbth0001-bth0-bth0-bth0-bth0bth0bth0', 'mai.l@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Mại Linh Tiên', '0905555551', 'Citizen', 'Quận Bình Thạnh', 'Phường 1', 1, NOW()),
  ('cbth0002-bth0-bth0-bth0-bth0bth0bth0', 'oc.p@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Ốc Phú Hạ', '0905555552', 'Citizen', 'Quận Bình Thạnh', 'Phường 13', 1, NOW()),
  ('cbth0003-bth0-bth0-bth0-bth0bth0bth0', 'no.d@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Nô Đông Anh', '0905555553', 'Citizen', 'Quận Bình Thạnh', 'Phường 25', 1, NOW()),
  ('cbth0004-bth0-bth0-bth0-bth0bth0bth0', 'an.t@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Ân Tú Anh', '0905555554', 'Citizen', 'Quận Bình Thạnh', 'Phường 26', 1, NOW());

-- Citizens Quận 5
INSERT INTO users (id, email, password_hash, full_name, phone, role, district, ward, is_active, created_at)
VALUES 
  ('c5555551-5555-5555-5555-555555555555', 'kim.u@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Kim Uyên Bảo', '0905555561', 'Citizen', 'Quận 5', 'Phường 1', 1, NOW()),
  ('c5555552-5555-5555-5555-555555555555', 'huy.h@gmail.com', '$2b$11$tN7EUn/GW3UfJFw4OFtpKewSWNBk5wmj8VmJHm.sVFWcL.dpx63PK', 'Huy Hùng Mạnh', '0905555562', 'Citizen', 'Quận 5', 'Phường 4', 1, NOW());

-- ============================================================
-- PHẦN 3: REWARD POINTS - Dữ liệu điểm chi tiết
-- ============================================================

-- Nguyễn Văn A (c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1) - TOP 1: 2500 điểm
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', NULL, 500, 'Report cao cấp + Bonus', DATE_SUB(NOW(), INTERVAL 45 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', NULL, 400, 'Report chu đáy', DATE_SUB(NOW(), INTERVAL 38 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', NULL, 350, 'Hoàn thành báo cáo', DATE_SUB(NOW(), INTERVAL 30 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', NULL, 450, 'Report chất lượng cao', DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', NULL, 320, 'Tham gia liên tục', DATE_SUB(NOW(), INTERVAL 15 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', NULL, 285, 'Report xuất sắc', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- Lê Thị B (c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2) - TOP 2: 1800 điểm
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', NULL, 450, 'Report cao cấp', DATE_SUB(NOW(), INTERVAL 40 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', NULL, 380, 'Report chất lượng', DATE_SUB(NOW(), INTERVAL 33 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', NULL, 320, 'Hoạt động liên tục', DATE_SUB(NOW(), INTERVAL 25 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', NULL, 380, 'Report tốt', DATE_SUB(NOW(), INTERVAL 18 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', NULL, 270, 'Report hữu ích', DATE_SUB(NOW(), INTERVAL 10 DAY));

-- Trần Văn C (c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3) - TOP 3: 950 điểm
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NULL, 350, 'Report cao cấp', DATE_SUB(NOW(), INTERVAL 35 DAY)),
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NULL, 280, 'Report xuất sắc', DATE_SUB(NOW(), INTERVAL 28 DAY)),
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NULL, 200, 'Hoàn thành báo cáo', DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', NULL, 120, 'Tham gia sớm', DATE_SUB(NOW(), INTERVAL 12 DAY));

-- Nguyễn Đức Anh (c1111111-1111-1111-1111-111111111111) - TOP 4: 1650 điểm - Q1
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c1111111-1111-1111-1111-111111111111', NULL, 420, 'Report chất lượng cao', DATE_SUB(NOW(), INTERVAL 50 DAY)),
  (UUID(), 'c1111111-1111-1111-1111-111111111111', NULL, 380, 'Report tốt', DATE_SUB(NOW(), INTERVAL 42 DAY)),
  (UUID(), 'c1111111-1111-1111-1111-111111111111', NULL, 350, 'Hoạt động liên tục', DATE_SUB(NOW(), INTERVAL 35 DAY)),
  (UUID(), 'c1111111-1111-1111-1111-111111111111', NULL, 300, 'Report bình thường', DATE_SUB(NOW(), INTERVAL 25 DAY)),
  (UUID(), 'c1111111-1111-1111-1111-111111111111', NULL, 200, 'Tham gia', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Trần Kỳ Linh (c1111112-1111-1111-1111-111111111111) - TOP 5: 1520 điểm - Q1
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c1111112-1111-1111-1111-111111111111', NULL, 400, 'Report hay', DATE_SUB(NOW(), INTERVAL 48 DAY)),
  (UUID(), 'c1111112-1111-1111-1111-111111111111', NULL, 360, 'Report chất lượng', DATE_SUB(NOW(), INTERVAL 40 DAY)),
  (UUID(), 'c1111112-1111-1111-1111-111111111111', NULL, 340, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 30 DAY)),
  (UUID(), 'c1111112-1111-1111-1111-111111111111', NULL, 280, 'Report tốt', DATE_SUB(NOW(), INTERVAL 18 DAY)),
  (UUID(), 'c1111112-1111-1111-1111-111111111111', NULL, 140, 'Tham gia', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Phạm Minh Tuấn (c1111113-1111-1111-1111-111111111111) - TOP 6: 1350 điểm - Q1
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c1111113-1111-1111-1111-111111111111', NULL, 380, 'Report chất lượng', DATE_SUB(NOW(), INTERVAL 46 DAY)),
  (UUID(), 'c1111113-1111-1111-1111-111111111111', NULL, 350, 'Report hay', DATE_SUB(NOW(), INTERVAL 38 DAY)),
  (UUID(), 'c1111113-1111-1111-1111-111111111111', NULL, 310, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 28 DAY)),
  (UUID(), 'c1111113-1111-1111-1111-111111111111', NULL, 310, 'Report tốt', DATE_SUB(NOW(), INTERVAL 12 DAY));

-- Lê Hoàng Phú (c1111114-1111-1111-1111-111111111111) - TOP 7: 1200 điểm - Q1
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c1111114-1111-1111-1111-111111111111', NULL, 360, 'Report tốt', DATE_SUB(NOW(), INTERVAL 44 DAY)),
  (UUID(), 'c1111114-1111-1111-1111-111111111111', NULL, 340, 'Report hay', DATE_SUB(NOW(), INTERVAL 36 DAY)),
  (UUID(), 'c1111114-1111-1111-1111-111111111111', NULL, 300, 'Tham gia', DATE_SUB(NOW(), INTERVAL 24 DAY)),
  (UUID(), 'c1111114-1111-1111-1111-111111111111', NULL, 200, 'Report', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Vũ Quốc Hưng (c3333331-3333-3333-3333-333333333333) - TOP 8: 1800 điểm - Q3
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c3333331-3333-3333-3333-333333333333', NULL, 440, 'Report cao cấp', DATE_SUB(NOW(), INTERVAL 52 DAY)),
  (UUID(), 'c3333331-3333-3333-3333-333333333333', NULL, 400, 'Report tốt', DATE_SUB(NOW(), INTERVAL 44 DAY)),
  (UUID(), 'c3333331-3333-3333-3333-333333333333', NULL, 380, 'Report hay', DATE_SUB(NOW(), INTERVAL 34 DAY)),
  (UUID(), 'c3333331-3333-3333-3333-333333333333', NULL, 320, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 22 DAY)),
  (UUID(), 'c3333331-3333-3333-3333-333333333333', NULL, 260, 'Tham gia', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- Đặng Linh Chi (c3333332-3333-3333-3333-333333333333) - TOP 9: 1650 điểm - Q3
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c3333332-3333-3333-3333-333333333333', NULL, 420, 'Report tốt', DATE_SUB(NOW(), INTERVAL 50 DAY)),
  (UUID(), 'c3333332-3333-3333-3333-333333333333', NULL, 390, 'Report hay', DATE_SUB(NOW(), INTERVAL 42 DAY)),
  (UUID(), 'c3333332-3333-3333-3333-333333333333', NULL, 350, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 32 DAY)),
  (UUID(), 'c3333332-3333-3333-3333-333333333333', NULL, 320, 'Report', DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (UUID(), 'c3333332-3333-3333-3333-333333333333', NULL, 175, 'Tham gia', DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Hoàng Thảo Nhi (c3333333-3333-3333-3333-333333333333) - TOP 10: 1400 điểm - Q3
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c3333333-3333-3333-3333-333333333333', NULL, 380, 'Report hay', DATE_SUB(NOW(), INTERVAL 48 DAY)),
  (UUID(), 'c3333333-3333-3333-3333-333333333333', NULL, 350, 'Report tốt', DATE_SUB(NOW(), INTERVAL 40 DAY)),
  (UUID(), 'c3333333-3333-3333-3333-333333333333', NULL, 330, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 30 DAY)),
  (UUID(), 'c3333333-3333-3333-3333-333333333333', NULL, 340, 'Report', DATE_SUB(NOW(), INTERVAL 14 DAY));

-- Tạ Nhân Bảo (c3333334-3333-3333-3333-333333333333) - 1100 điểm - Q3
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c3333334-3333-3333-3333-333333333333', NULL, 350, 'Report', DATE_SUB(NOW(), INTERVAL 46 DAY)),
  (UUID(), 'c3333334-3333-3333-3333-333333333333', NULL, 330, 'Report hay', DATE_SUB(NOW(), INTERVAL 38 DAY)),
  (UUID(), 'c3333334-3333-3333-3333-333333333333', NULL, 320, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 26 DAY)),
  (UUID(), 'c3333334-3333-3333-3333-333333333333', NULL, 100, 'Tham gia', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Mại Linh Tiên (cbth0001-bth0-bth0-bth0-bth0bth0bth0) - 1650 điểm - Bình Thạnh
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'cbth0001-bth0-bth0-bth0-bth0bth0bth0', NULL, 430, 'Report tốt', DATE_SUB(NOW(), INTERVAL 51 DAY)),
  (UUID(), 'cbth0001-bth0-bth0-bth0-bth0bth0bth0', NULL, 390, 'Report hay', DATE_SUB(NOW(), INTERVAL 43 DAY)),
  (UUID(), 'cbth0001-bth0-bth0-bth0-bth0bth0bth0', NULL, 360, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 33 DAY)),
  (UUID(), 'cbth0001-bth0-bth0-bth0-bth0bth0bth0', NULL, 330, 'Report', DATE_SUB(NOW(), INTERVAL 19 DAY)),
  (UUID(), 'cbth0001-bth0-bth0-bth0-bth0bth0bth0', NULL, 140, 'Tham gia', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Ốc Phú Hạ (cbth0002-bth0-bth0-bth0-bth0bth0bth0) - 1480 điểm - Bình Thạnh
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'cbth0002-bth0-bth0-bth0-bth0bth0bth0', NULL, 410, 'Report hay', DATE_SUB(NOW(), INTERVAL 49 DAY)),
  (UUID(), 'cbth0002-bth0-bth0-bth0-bth0bth0bth0', NULL, 370, 'Report tốt', DATE_SUB(NOW(), INTERVAL 41 DAY)),
  (UUID(), 'cbth0002-bth0-bth0-bth0-bth0bth0bth0', NULL, 340, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 31 DAY)),
  (UUID(), 'cbth0002-bth0-bth0-bth0-bth0bth0bth0', NULL, 360, 'Report', DATE_SUB(NOW(), INTERVAL 17 DAY));

-- Nô Đông Anh (cbth0003-bth0-bth0-bth0-bth0bth0bth0) - 1250 điểm - Bình Thạnh
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'cbth0003-bth0-bth0-bth0-bth0bth0bth0', NULL, 380, 'Report', DATE_SUB(NOW(), INTERVAL 47 DAY)),
  (UUID(), 'cbth0003-bth0-bth0-bth0-bth0bth0bth0', NULL, 350, 'Report hay', DATE_SUB(NOW(), INTERVAL 39 DAY)),
  (UUID(), 'cbth0003-bth0-bth0-bth0-bth0bth0bth0', NULL, 320, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 27 DAY)),
  (UUID(), 'cbth0003-bth0-bth0-bth0-bth0bth0bth0', NULL, 200, 'Tham gia', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Ân Tú Anh (cbth0004-bth0-bth0-bth0-bth0bth0bth0) - 950 điểm - Bình Thạnh
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'cbth0004-bth0-bth0-bth0-bth0bth0bth0', NULL, 350, 'Report hay', DATE_SUB(NOW(), INTERVAL 45 DAY)),
  (UUID(), 'cbth0004-bth0-bth0-bth0-bth0bth0bth0', NULL, 320, 'Report tốt', DATE_SUB(NOW(), INTERVAL 37 DAY)),
  (UUID(), 'cbth0004-bth0-bth0-bth0-bth0bth0bth0', NULL, 280, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 25 DAY));

-- Kim Uyên Bảo (c5555551-5555-5555-5555-555555555555) - 1350 điểm - Q5
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c5555551-5555-5555-5555-555555555555', NULL, 400, 'Report hay', DATE_SUB(NOW(), INTERVAL 50 DAY)),
  (UUID(), 'c5555551-5555-5555-5555-555555555555', NULL, 370, 'Report tốt', DATE_SUB(NOW(), INTERVAL 42 DAY)),
  (UUID(), 'c5555551-5555-5555-5555-555555555555', NULL, 340, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 32 DAY)),
  (UUID(), 'c5555551-5555-5555-5555-555555555555', NULL, 240, 'Tham gia', DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Huy Hùng Mạnh (c5555552-5555-5555-5555-555555555555) - 1100 điểm - Q5
INSERT INTO reward_points (id, citizen_id, report_id, points, reason, created_at) VALUES
  (UUID(), 'c5555552-5555-5555-5555-555555555555', NULL, 360, 'Report tốt', DATE_SUB(NOW(), INTERVAL 48 DAY)),
  (UUID(), 'c5555552-5555-5555-5555-555555555555', NULL, 340, 'Report hay', DATE_SUB(NOW(), INTERVAL 40 DAY)),
  (UUID(), 'c5555552-5555-5555-5555-555555555555', NULL, 300, 'Hoạt động', DATE_SUB(NOW(), INTERVAL 28 DAY)),
  (UUID(), 'c5555552-5555-5555-5555-555555555555', NULL, 100, 'Tham gia', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- ============================================================
-- KIỂM CHỨNG DỮ LIỆU
-- ============================================================

SELECT '\n=== GLOBAL LEADERBOARD ===' as info;
SELECT 
    u.full_name as 'Tên',
    u.district as 'Quận',
    COUNT(rp.id) as 'Báo cáo',
    SUM(rp.points) as 'Tổng điểm',
    RANK() OVER (ORDER BY SUM(rp.points) DESC) as 'Xếp hạng'
FROM reward_points rp
JOIN users u ON rp.citizen_id = u.id
WHERE u.role = 'Citizen'
GROUP BY rp.citizen_id, u.full_name, u.district
ORDER BY SUM(rp.points) DESC
LIMIT 15;

SELECT '\n=== AREA LEADERBOARD ===' as info;
SELECT 
    u.district as 'Quận/Huyện',
    COUNT(DISTINCT rp.citizen_id) as 'Số người dân',
    COUNT(rp.id) as 'Tổng báo cáo',
    SUM(rp.points) as 'Tổng điểm',
    RANK() OVER (ORDER BY SUM(rp.points) DESC) as 'Xếp hạng'
FROM reward_points rp
JOIN users u ON rp.citizen_id = u.id
WHERE u.role = 'Citizen'
GROUP BY u.district
ORDER BY SUM(rp.points) DESC;

SELECT '\n✅ Dữ liệu test bảng xếp hạng đã được thêm thành công!' as status;
