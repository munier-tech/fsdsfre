import { DataTypes } from 'sequelize';
import sequelize from '../lib/database.js';

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Teacher name is required'
      }
    },
    set(value) {
      this.setDataValue('name', value.trim());
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Must be a valid email'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      }
    },
    set(value) {
      this.setDataValue('number', value.trim());
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Subject is required'
      }
    },
    set(value) {
      this.setDataValue('subject', value.trim());
    }
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      this.setDataValue('profilePicture', value ? value.trim() : null);
    }
  },
  attendance: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  certificate: {
    type: DataTypes.STRING,
    allowNull: true,
    set(value) {
      this.setDataValue('certificate', value ? value.trim() : null);
    }
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['name']
    },
    {
      fields: ['subject']
    }
  ]
});

export default Teacher;