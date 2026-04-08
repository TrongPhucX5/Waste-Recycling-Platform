-- ============================================================
-- Insert Reward Points for Leaderboard Testing
-- 
-- Citizens:
-- - Nguyễn Văn A (c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1): 2500 points
-- - Lê Thị B (c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2): 1800 points
-- - Trần Văn C (c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3): 950 points
-- ============================================================

USE wasteplatform;

-- Clear existing reward points (optional - comment out if you want to keep them)
-- DELETE FROM reward_points;

-- Reward points for Nguyễn Văn A (c1) - Top 1 with 2500 points
INSERT INTO reward_points (id, citizen_id, points, reason, created_at)
VALUES 
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 500, 'Báo cáo chu đáy - Báo cáo chất lượng cao', DATE_SUB(NOW(), INTERVAL 45 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 400, 'Báo cáo chu đáy - Báo cáo chất lượng cao', DATE_SUB(NOW(), INTERVAL 38 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 350, 'Thưởng mở mắt - Tham gia thực tiễn', DATE_SUB(NOW(), INTERVAL 30 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 450, 'Báo cáo chu đáy - Báo cáo chất lượng cao', DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 320, 'Mời bạn bè tham gia CWCRP', DATE_SUB(NOW(), INTERVAL 15 DAY)),
  (UUID(), 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 285, 'Báo cáo xuất sắc', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- Reward points for Lê Thị B (c2) - Top 2 with 1800 points
INSERT INTO reward_points (id, citizen_id, points, reason, created_at)
VALUES 
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 450, 'Báo cáo chu đáy - Báo cáo chất lượng cao', DATE_SUB(NOW(), INTERVAL 40 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 380, 'Báo cáo chu đáy - Báo cáo chất lượng cao', DATE_SUB(NOW(), INTERVAL 33 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 320, 'Duy trì hoạt động 2 tuần liên tiếp', DATE_SUB(NOW(), INTERVAL 25 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 380, 'Báo cáo chu đáy - Báo cáo chất lượng cao', DATE_SUB(NOW(), INTERVAL 18 DAY)),
  (UUID(), 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 290, 'Báo cáo hữu ích', DATE_SUB(NOW(), INTERVAL 10 DAY));

-- Reward points for Trần Văn C (c3) - Top 3 with 950 points
INSERT INTO reward_points (id, citizen_id, points, reason, created_at)
VALUES 
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 350, 'Báo cáo chu đáy - Báo cáo chất lượng cao', DATE_SUB(NOW(), INTERVAL 35 DAY)),
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 280, 'Báo cáo xuất sắc', DATE_SUB(NOW(), INTERVAL 28 DAY)),
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 200, 'Hoàn thành báo cáo', DATE_SUB(NOW(), INTERVAL 20 DAY)),
  (UUID(), 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 120, 'Tham gia sớm', DATE_SUB(NOW(), INTERVAL 12 DAY));

-- Verify data
SELECT 'Reward points inserted successfully!' as status;
SELECT 
    u.full_name,
    u.email,
    SUM(rp.points) as total_points,
    COUNT(rp.id) as reward_count
FROM reward_points rp
JOIN users u ON rp.citizen_id = u.id
WHERE u.role = 'Citizen'
GROUP BY rp.citizen_id, u.full_name, u.email
ORDER BY total_points DESC;
