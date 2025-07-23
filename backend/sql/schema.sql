-- PostgreSQL Schema for School Management System
-- Generated from Mongoose to Sequelize conversion

-- Create database (run as superuser)
-- CREATE DATABASE school_management;
-- GRANT ALL PRIVILEGES ON DATABASE school_management TO postgres;

-- Use the database
\c school_management;

-- Enable UUID extension (optional, if you want to use UUIDs instead of SERIAL)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "Users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(20) CHECK ("role" IN ('admin', 'teacher', 'user')) DEFAULT 'user',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS "Teachers" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "number" VARCHAR(255) NOT NULL,
  "subject" VARCHAR(255) NOT NULL,
  "profilePicture" VARCHAR(500),
  "attendance" INTEGER DEFAULT 0,
  "certificate" VARCHAR(500),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS "Classes" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "level" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS "Students" (
  "id" SERIAL PRIMARY KEY,
  "fullname" VARCHAR(255) NOT NULL,
  "age" INTEGER CHECK ("age" >= 0),
  "gender" VARCHAR(10) CHECK ("gender" IN ('male', 'female')),
  "classId" INTEGER REFERENCES "Classes"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "fee_total" DECIMAL(10,2) DEFAULT 0,
  "fee_paid" DECIMAL(10,2) DEFAULT 0,
  "motherNumber" VARCHAR(255) NOT NULL,
  "fatherNumber" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Health records table
CREATE TABLE IF NOT EXISTS "Healths" (
  "id" SERIAL PRIMARY KEY,
  "studentId" INTEGER NOT NULL REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "condition" VARCHAR(255) NOT NULL,
  "treated" BOOLEAN NOT NULL DEFAULT false,
  "note" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Attendance table (main attendance record per class per day)
CREATE TABLE IF NOT EXISTS "Attendances" (
  "id" SERIAL PRIMARY KEY,
  "classId" INTEGER NOT NULL REFERENCES "Classes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "date" DATE NOT NULL DEFAULT CURRENT_DATE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "unique_class_date" UNIQUE ("classId", "date")
);

-- Attendance records table (individual student attendance per attendance record)
CREATE TABLE IF NOT EXISTS "AttendanceRecords" (
  "id" SERIAL PRIMARY KEY,
  "attendanceId" INTEGER NOT NULL REFERENCES "Attendances"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "studentId" INTEGER NOT NULL REFERENCES "Students"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "status" VARCHAR(10) CHECK ("status" IN ('present', 'absent', 'late')) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "unique_attendance_student" UNIQUE ("attendanceId", "studentId")
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "Users"("email");
CREATE INDEX IF NOT EXISTS "idx_teachers_email" ON "Teachers"("email");
CREATE INDEX IF NOT EXISTS "idx_teachers_name" ON "Teachers"("name");
CREATE INDEX IF NOT EXISTS "idx_teachers_subject" ON "Teachers"("subject");
CREATE INDEX IF NOT EXISTS "idx_classes_name" ON "Classes"("name");
CREATE INDEX IF NOT EXISTS "idx_classes_level" ON "Classes"("level");
CREATE INDEX IF NOT EXISTS "idx_students_fullname" ON "Students"("fullname");
CREATE INDEX IF NOT EXISTS "idx_students_classId" ON "Students"("classId");
CREATE INDEX IF NOT EXISTS "idx_students_gender" ON "Students"("gender");
CREATE INDEX IF NOT EXISTS "idx_students_createdAt" ON "Students"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_healths_studentId" ON "Healths"("studentId");
CREATE INDEX IF NOT EXISTS "idx_healths_date" ON "Healths"("date");
CREATE INDEX IF NOT EXISTS "idx_healths_treated" ON "Healths"("treated");
CREATE INDEX IF NOT EXISTS "idx_attendances_classId" ON "Attendances"("classId");
CREATE INDEX IF NOT EXISTS "idx_attendances_date" ON "Attendances"("date");
CREATE INDEX IF NOT EXISTS "idx_attendance_records_attendanceId" ON "AttendanceRecords"("attendanceId");
CREATE INDEX IF NOT EXISTS "idx_attendance_records_studentId" ON "AttendanceRecords"("studentId");

-- Sample data (optional)
-- Insert a default admin user (password is 'admin123')
INSERT INTO "Users" ("username", "email", "password", "role", "createdAt", "updatedAt") 
VALUES ('admin', 'admin@school.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Insert sample classes
INSERT INTO "Classes" ("name", "level", "createdAt", "updatedAt") 
VALUES 
  ('Grade 1A', 'Primary', NOW(), NOW()),
  ('Grade 2A', 'Primary', NOW(), NOW()),
  ('Grade 3A', 'Primary', NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;