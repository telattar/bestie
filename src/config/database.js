import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import Logger from '../utils/logger.js';

config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  timezone: process.env.TIMEZONE,
  ssl: true,
  define: {
    timestamps: true,
    paranoid: true, //support soft delete
  },
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    Logger.info('DB Connection has been established successfully.');
    await sequelize.sync({ alter: true });
    Logger.info('DB Tables have been synced.');
  } catch (error) {
    Logger.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
