import { DataTypes } from 'sequelize';
import sequelize from '../lib/database.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Classes',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      fields: ['classId']
    },
    {
      fields: ['date']
    },
    {
      unique: true,
      fields: ['classId', 'date'],
      name: 'unique_class_date'
    }
  ]
});

// Attendance Records for individual students
const AttendanceRecord = sequelize.define('AttendanceRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attendanceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Attendances',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['present', 'absent', 'late']],
        msg: 'Status must be present, absent, or late'
      }
    }
  }
}, {
  indexes: [
    {
      fields: ['attendanceId']
    },
    {
      fields: ['studentId']
    },
    {
      unique: true,
      fields: ['attendanceId', 'studentId'],
      name: 'unique_attendance_student'
    }
  ]
});

export { Attendance, AttendanceRecord };