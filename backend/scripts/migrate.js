import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDb } from '../lib/database.js';
import { syncDatabase } from '../models/index.js';
import {
  User,
  Class,
  Student,
  Teacher,
  Health,
  Attendance,
  AttendanceRecord
} from '../models/index.js';

// Import MongoDB models for data extraction
import MongoUser from '../models/userModel.js';
import MongoStudent from '../models/studentsModel.js';
import MongoClass from '../models/classModel.js';
import MongoTeacher from '../models/teachersModel.js';
import MongoHealth from '../models/healthModel.js';
import MongoAttendance from '../models/attendanceModel.js';

dotenv.config();

const migrateData = async () => {
  try {
    console.log('🚀 Starting data migration from MongoDB to PostgreSQL...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Connect to PostgreSQL
    await connectDb();
    console.log('✅ Connected to PostgreSQL');

    // Sync PostgreSQL database (create tables)
    await syncDatabase(true); // force: true to recreate tables
    console.log('✅ PostgreSQL tables created/synced');

    // Migrate Users
    console.log('📦 Migrating Users...');
    const mongoUsers = await MongoUser.find({});
    for (const mongoUser of mongoUsers) {
      await User.create({
        username: mongoUser.username,
        email: mongoUser.email,
        password: mongoUser.password, // Already hashed
        role: mongoUser.role,
        createdAt: mongoUser.createdAt,
        updatedAt: mongoUser.updatedAt
      });
    }
    console.log(`✅ Migrated ${mongoUsers.length} users`);

    // Migrate Teachers
    console.log('📦 Migrating Teachers...');
    const mongoTeachers = await MongoTeacher.find({});
    for (const mongoTeacher of mongoTeachers) {
      await Teacher.create({
        name: mongoTeacher.name,
        email: mongoTeacher.email,
        number: mongoTeacher.number,
        subject: mongoTeacher.subject,
        profilePicture: mongoTeacher.profilePicture,
        attendance: mongoTeacher.attendance || 0,
        certificate: mongoTeacher.certificate,
        createdAt: mongoTeacher.createdAt,
        updatedAt: mongoTeacher.updatedAt
      });
    }
    console.log(`✅ Migrated ${mongoTeachers.length} teachers`);

    // Migrate Classes
    console.log('📦 Migrating Classes...');
    const mongoClasses = await MongoClass.find({});
    const classMapping = new Map(); // MongoDB _id -> PostgreSQL id

    for (const mongoClass of mongoClasses) {
      const newClass = await Class.create({
        name: mongoClass.name,
        level: mongoClass.level,
        createdAt: mongoClass.createdAt,
        updatedAt: mongoClass.updatedAt
      });
      classMapping.set(mongoClass._id.toString(), newClass.id);
    }
    console.log(`✅ Migrated ${mongoClasses.length} classes`);

    // Migrate Students
    console.log('📦 Migrating Students...');
    const mongoStudents = await MongoStudent.find({}).populate('class');
    const studentMapping = new Map(); // MongoDB _id -> PostgreSQL id

    for (const mongoStudent of mongoStudents) {
      const classId = mongoStudent.class ? classMapping.get(mongoStudent.class._id.toString()) : null;
      
      const newStudent = await Student.create({
        fullname: mongoStudent.fullname,
        age: mongoStudent.age,
        gender: mongoStudent.gender,
        classId: classId,
        feeTotal: mongoStudent.fee?.total || 0,
        feePaid: mongoStudent.fee?.paid || 0,
        motherNumber: mongoStudent.motherNumber,
        fatherNumber: mongoStudent.fatherNumber,
        createdAt: mongoStudent.createdAt,
        updatedAt: mongoStudent.updatedAt
      });
      studentMapping.set(mongoStudent._id.toString(), newStudent.id);
    }
    console.log(`✅ Migrated ${mongoStudents.length} students`);

    // Migrate Health Records
    console.log('📦 Migrating Health Records...');
    const mongoHealthRecords = await MongoHealth.find({}).populate('student');
    for (const mongoHealth of mongoHealthRecords) {
      const studentId = studentMapping.get(mongoHealth.student._id.toString());
      if (studentId) {
        await Health.create({
          studentId: studentId,
          date: mongoHealth.date,
          condition: mongoHealth.condition,
          treated: mongoHealth.treated,
          note: mongoHealth.note,
          createdAt: mongoHealth.createdAt,
          updatedAt: mongoHealth.updatedAt
        });
      }
    }
    console.log(`✅ Migrated ${mongoHealthRecords.length} health records`);

    // Migrate Attendance
    console.log('📦 Migrating Attendance Records...');
    const mongoAttendances = await MongoAttendance.find({}).populate('class students.student');
    for (const mongoAttendance of mongoAttendances) {
      const classId = classMapping.get(mongoAttendance.class._id.toString());
      if (classId) {
        const newAttendance = await Attendance.create({
          classId: classId,
          date: mongoAttendance.date,
          createdAt: mongoAttendance.createdAt,
          updatedAt: mongoAttendance.updatedAt
        });

        // Migrate attendance records for each student
        for (const studentRecord of mongoAttendance.students) {
          const studentId = studentMapping.get(studentRecord.student._id.toString());
          if (studentId) {
            await AttendanceRecord.create({
              attendanceId: newAttendance.id,
              studentId: studentId,
              status: studentRecord.status
            });
          }
        }
      }
    }
    console.log(`✅ Migrated ${mongoAttendances.length} attendance records`);

    console.log('🎉 Data migration completed successfully!');
    
    // Close connections
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateData();