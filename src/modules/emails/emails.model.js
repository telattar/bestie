import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import User from '../users/users.model.js';

const Email = sequelize.define('Email', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(Email, { foreignKey: 'userId' });
Email.belongsTo(User, { foreignKey: 'userId' });
export default Email;
