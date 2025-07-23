import sequelize from '../lib/database.js';
import User from './User.js';
import Class from './Class.js';
import Student from './Student.js';
import Teacher from './Teacher.js';
import { Attendance, AttendanceRecord } from './Attendance.js';
import Health from './Health.js';

// Define relationships

// Class - Student (One-to-Many)
Class.hasMany(Student, {
  foreignKey: 'classId',
  as: 'students',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Student.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class'
});

// Class - Attendance (One-to-Many)
Class.hasMany(Attendance, {
  foreignKey: 'classId',
  as: 'attendances',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Attendance.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class'
});

// Attendance - AttendanceRecord (One-to-Many)
Attendance.hasMany(AttendanceRecord, {
  foreignKey: 'attendanceId',
  as: 'records',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AttendanceRecord.belongsTo(Attendance, {
  foreignKey: 'attendanceId',
  as: 'attendance'
});

// Student - AttendanceRecord (One-to-Many)
Student.hasMany(AttendanceRecord, {
  foreignKey: 'studentId',
  as: 'attendanceRecords',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AttendanceRecord.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

// Student - Health (One-to-Many)
Student.hasMany(Health, {
  foreignKey: 'studentId',
  as: 'healthRecords',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Health.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student'
});

// Export all models
export {
  sequelize,
  User,
  Class,
  Student,
  Teacher,
  Attendance,
  AttendanceRecord,
  Health
};

// Sync all models
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ All models synced successfully');
  } catch (error) {
    console.error('❌ Error syncing models:', error);
    throw error;
  }
};