import { StatusCodes } from 'http-status-codes';
import { UsersService } from './users.service.js';
import jwt from 'jsonwebtoken';
import Logger from '../../utils/logger.js';

export const UsersController = {
  async createUser(req, res) {
    try {
      const { name, email } = req.body;
      const createdUser = await UsersService.create({ name, email });
      return res.status(StatusCodes.CREATED).json({ createdUser });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await UsersService.getAll();
      return res.status(StatusCodes.OK).json({ users });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      await UsersService.updateOne({ id, updatedData });
      return res.status(StatusCodes.NO_CONTENT).json();
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  },

  async unsubscribeFromEmails(req, res) {
    try {
      const { token } = req.query;
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      await UsersService.updateOne({ id: userId, updatedData: { isSubscribed: false } });
      return res.status(StatusCodes.OK).send('<h1> done 😢 </h1>');
    } catch (error) {
      Logger.error(`while unsubscribing user from emails: ${error}`);
      return res.status(error.status).send('<h1> Something went wrong. Please try again. </h1>');
    }
  },
};
