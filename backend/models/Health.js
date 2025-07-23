import { DataTypes } from 'sequelize';
import sequelize from '../lib/database.js';

const Health = sequelize.define('Health', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Health condition is required'
      }
    }
  },
  treated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['studentId']
    },
    {
      fields: ['date']
    },
    {
      fields: ['treated']
    }
  ]
});

export default Health;