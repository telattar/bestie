import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isSubscribed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastEmailedAt: {
    type: DataTypes.DATE, //timestamptz for postgres
  },
  birthday: {
    type: DataTypes.DATEONLY,
  },
});

export default User;
