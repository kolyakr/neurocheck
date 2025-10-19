-- MySQL Database Initialization Script for Neurocheck
-- This script creates all necessary tables and indexes

-- Create database if it doesn't exist (this is handled by Docker)
-- USE neurocheck;

-- Create enums (MySQL doesn't have native enums like PostgreSQL, so we'll use VARCHAR with CHECK constraints)
-- We'll handle enum validation in the application layer

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires TIMESTAMP NULL
);

-- Create diagnosis_sessions table
CREATE TABLE IF NOT EXISTS diagnosis_sessions (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    -- Symptom Data
    age INT NULL,
    gender ENUM('male', 'female', 'other') NULL,
    fatigue_severity_scale_score DECIMAL(3,1) NULL,
    depression_phq9_score INT NULL,
    pem_present BOOLEAN NULL,
    pem_duration_hours DECIMAL(5,1) NULL,
    sleep_quality_index INT NULL,
    brain_fog_level INT NULL,
    physical_pain_score INT NULL,
    stress_level INT NULL,
    work_status ENUM('working', 'partially_working', 'not_working') NULL,
    social_activity_level ENUM('very_low', 'low', 'medium', 'high', 'very_high') NULL,
    exercise_frequency ENUM('never', 'rarely', 'sometimes', 'often', 'daily') NULL,
    meditation_or_mindfulness BOOLEAN NULL,
    hours_of_sleep_per_night DECIMAL(3,1) NULL,
    notes TEXT NULL,
    
    -- ML Model Results
    predicted_diagnosis ENUM('depression', 'mecfs', 'both') NULL,
    confidence_score DECIMAL(5,2) NULL,
    model_version VARCHAR(50) NULL,
    processing_time_ms INT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    diagnosis_session_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    message_type ENUM('user', 'assistant', 'system') NOT NULL,
    content TEXT NOT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (diagnosis_session_id) REFERENCES diagnosis_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    theme ENUM('light', 'dark', 'system') DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    data_sharing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    session_id VARCHAR(36) NULL,
    log_level ENUM('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    message TEXT NOT NULL,
    metadata JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (session_id) REFERENCES diagnosis_sessions(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_user_id ON diagnosis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_status ON diagnosis_sessions(status);
CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_started_at ON diagnosis_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_diagnosis_sessions_predicted_diagnosis ON diagnosis_sessions(predicted_diagnosis);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(diagnosis_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
