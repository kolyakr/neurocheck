-- MySQL Seed Data for Neurocheck
-- This script populates the database with sample data

-- Insert test users
INSERT INTO users (id, email, name, password_hash, email_verified, last_login, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'test@example.com', 'Test User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz8', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'demo@neurocheck.com', 'Demo User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz8', true, NOW(), NOW());

-- Insert user preferences
INSERT INTO user_preferences (id, user_id, theme, notifications_enabled, email_notifications, data_sharing_consent, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'light', true, true, false, NOW()),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'dark', true, false, true, NOW());

-- Insert diagnosis sessions
INSERT INTO diagnosis_sessions (id, user_id, session_token, status, age, gender, fatigue_severity_scale_score, depression_phq9_score, pem_present, pem_duration_hours, sleep_quality_index, brain_fog_level, physical_pain_score, stress_level, work_status, social_activity_level, exercise_frequency, meditation_or_mindfulness, hours_of_sleep_per_night, notes, predicted_diagnosis, confidence_score, model_version, processing_time_ms, completed_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'session-depression-001', 'completed', 28, 'female', 7.5, 12, false, NULL, 6, 5, 4, 6, 'working', 'medium', 'sometimes', true, 7.5, 'Feeling tired and unmotivated lately', 'depression', 85.5, 'v1.0.0', 1200, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 'session-mecfs-001', 'completed', 28, 'female', 8.2, 8, true, 24, 4, 7, 6, 5, 'partially_working', 'low', 'rarely', false, 6, 'Severe fatigue after minimal activity', 'mecfs', 78.3, 'v1.0.0', 1100, DATE_SUB(NOW(), INTERVAL 14 DAY), NOW()),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440001', 'session-both-001', 'completed', 28, 'female', 9.1, 15, true, 48, 3, 8, 7, 8, 'not_working', 'very_low', 'never', false, 5, 'Combination of severe fatigue and depression symptoms', 'both', 72.1, 'v1.0.0', 1350, DATE_SUB(NOW(), INTERVAL 21 DAY), NOW()),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440001', 'session-recent-001', 'completed', 28, 'female', 6.8, 10, false, NULL, 7, 4, 3, 5, 'working', 'medium', 'often', true, 8, 'Feeling better after treatment', 'depression', 82.3, 'v1.0.0', 980, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440002', 'demo-session-001', 'completed', 35, 'male', 6.5, 9, false, NULL, 5, 6, 5, 7, 'working', 'high', 'daily', true, 7, 'Demo session for testing', 'depression', 76.8, 'v1.0.0', 1050, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- Insert chat messages
INSERT INTO chat_messages (id, diagnosis_session_id, user_id, message_type, content) VALUES 
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'user', 'Can you explain why I got a depression diagnosis?'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'assistant', 'Based on your symptoms, particularly your PHQ-9 depression score of 12 and the absence of post-exertional malaise, the model suggests depression. Your fatigue and sleep issues are common in depression.'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'user', 'What should I do next?'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'assistant', 'I recommend consulting with a mental health professional for proper evaluation. Consider maintaining a regular sleep schedule and engaging in light physical activity.'),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 'user', 'Why did I get ME/CFS diagnosis?'),
('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 'assistant', 'Your symptoms, especially post-exertional malaise (PEM) lasting 24 hours, severe fatigue (8.2/10), and cognitive difficulties suggest ME/CFS. PEM is a hallmark symptom of this condition.');

-- Insert system logs
INSERT INTO system_logs (id, user_id, session_id, log_level, message, metadata, ip_address, user_agent) VALUES 
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 'INFO', 'Diagnosis session completed successfully', '{"diagnosis": "depression", "confidence": 85.5}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440022', 'INFO', 'Diagnosis session completed successfully', '{"diagnosis": "mecfs", "confidence": 78.3}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440001', NULL, 'INFO', 'User preferences updated', '{"theme": "light", "notifications": true}', NULL, NULL);
