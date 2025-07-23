import { DataTypes } from 'sequelize';
import sequelize from '../lib/database.js';

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Class name is required'
      }
    }
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Level is required'
      }
    }
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['name']
    },
    {
      fields: ['level']
    }
  ]
});

export default Class;