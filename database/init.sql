-- Create enums
CREATE TYPE "DiagnosisType" AS ENUM ('depression', 'mecfs', 'both');
CREATE TYPE "TrendType" AS ENUM ('improving', 'stable', 'declining');
CREATE TYPE "MessageType" AS ENUM ('user', 'assistant', 'system');
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');
CREATE TYPE "WorkStatus" AS ENUM ('working', 'partially_working', 'not_working');
CREATE TYPE "SocialActivityLevel" AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');
CREATE TYPE "ExerciseFrequency" AS ENUM ('never', 'rarely', 'sometimes', 'often', 'daily');
CREATE TYPE "LogLevel" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');
CREATE TYPE "Theme" AS ENUM ('light', 'dark', 'system');

-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "password_reset_token" TEXT,
    "password_reset_expires" TIMESTAMP(3),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create diagnosis_sessions table
CREATE TABLE "diagnosis_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "age" INTEGER,
    "gender" "Gender",
    "fatigue_severity_scale_score" DOUBLE PRECISION,
    "depression_phq9_score" INTEGER,
    "pem_present" BOOLEAN,
    "pem_duration_hours" DOUBLE PRECISION,
    "sleep_quality_index" INTEGER,
    "brain_fog_level" INTEGER,
    "physical_pain_score" INTEGER,
    "stress_level" INTEGER,
    "work_status" "WorkStatus",
    "social_activity_level" "SocialActivityLevel",
    "exercise_frequency" "ExerciseFrequency",
    "meditation_or_mindfulness" BOOLEAN,
    "hours_of_sleep_per_night" DOUBLE PRECISION,
    "notes" TEXT,
    "predicted_diagnosis" "DiagnosisType",
    "confidence_score" DOUBLE PRECISION,
    "model_version" TEXT,
    "processing_time_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "diagnosis_sessions_pkey" PRIMARY KEY ("id")
);

-- Create chat_messages table
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "diagnosis_session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message_type" "MessageType" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- Create user_preferences table
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "theme" "Theme" NOT NULL DEFAULT 'light',
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "data_sharing_consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- Create system_logs table
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "log_level" "LogLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "diagnosis_sessions_session_token_key" ON "diagnosis_sessions"("session_token");
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- Add foreign key constraints
ALTER TABLE "diagnosis_sessions" ADD CONSTRAINT "diagnosis_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_diagnosis_session_id_fkey" FOREIGN KEY ("diagnosis_session_id") REFERENCES "diagnosis_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "diagnosis_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
