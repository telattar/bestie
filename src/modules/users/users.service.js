import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../classes/api-error.js';
import User from './users.model.js';
import { EmailsService } from '../emails/emails.service.js';

export const UsersService = {
  /**
   * Creates a new user. This also makes them subscribed to the email list.
   * @param {object} param - The parameter object.
   * @param {string} param.name - The name of the user.
   * @param {string} param.email - The email of the user.
   *
   * @returns {Promise<User>} The created user.
   */
  async create({ name, email, birthday = null }) {
    const createdUser = await User.create({ name, email, birthday });
    await EmailsService.sendWelcomeEmail({ to: createdUser.id });
    return createdUser;
  },

  /**
   * Fetches all users from the database. Only an authenticated user can do this.
   * @returns {Promise<User[]>} The list of users excluding soft-deleted ones.
   */
  async getAll() {
    const users = await User.findAll();
    return users;
  },

  /**
   * Updates one user by ID
   * @param {object} param - The parameter object.
   * @param {string} param.id - The ID of the user.
   * @param {object} param.updatedData - The updated data of the user.
   * @returns {Promise<User>} The updated user.
   * @throws {ApiError} If the user is not found.
   */
  async updateOne({ id, updatedData }) {
    const [affectedCount, updatedUser] = await User.update(updatedData, {
      where: { id },
      returning: true,
    });

    if (affectedCount === 0) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.');

    return updatedUser[0];
  },
};
