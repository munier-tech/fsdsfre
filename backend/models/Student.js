import { DataTypes } from 'sequelize';
import sequelize from '../lib/database.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Full name is required'
      }
    }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: 0,
        msg: 'Age must be a positive number'
      }
    }
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    validate: {
      isIn: {
        args: [['male', 'female']],
        msg: 'Gender must be either male or female'
      }
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Classes',
      key: 'id'
    },
    allowNull: true
  },
  feeTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'fee_total'
  },
  feePaid: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'fee_paid'
  },
  motherNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Mother\'s phone number is required'
      }
    }
  },
  fatherNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Father\'s phone number is required'
      }
    }
  }
}, {
  indexes: [
    {
      fields: ['fullname']
    },
    {
      fields: ['classId']
    },
    {
      fields: ['gender']
    },
    {
      fields: ['createdAt']
    }
  ]
});

export default Student;