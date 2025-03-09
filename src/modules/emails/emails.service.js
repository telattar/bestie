import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../classes/api-error.js';
import User from '../users/users.model.js';
import Email from './emails.model.js';
import { EmailSenderService } from '../../common/services/email-sender.service.js';
import sequelize from '../../config/database.js';
import Logger from '../../utils/logger.js';
import { AIIntegrationService } from '../../common/services/ai-integration.service.js';
import jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize';
import { calculateAge } from '../../utils/date.js';

export const EmailsService = {
  /**
   * Creates a new email in the db and sends it to the user with the specified id.
   * This also updates the user's lastEmailedAt field.
   * @param {object} param - The parameter object.
   * @param {string} param.userId - The ID of the user.
   * @param {string} param.subject - The subject of the email.
   * @param {string} param.body - The body of the email.
   * @returns {Promise<void>} - A promise that resolves when the email is sent.
   * @throws {ApiError} If the user is not found or if something went wrong while sending the email.
   */
  async send({ userId, subject, body, includeUnsubscribe = true }) {
    const { email: userEmail } = await User.findByPk(userId);
    if (!userEmail) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.');

    body += includeUnsubscribe ? this.getUnsubscribeSignOff({ userId }) : '';
    const createdEmail = await Email.create({ userId, subject, body });

    try {
      await sequelize.transaction(async (transaction) => {
        await EmailSenderService.sendOne({ to: userEmail, subject, body });
        await createdEmail.update({ isDelivered: true }, { transaction });
        await User.update({ lastEmailedAt: new Date().toISOString() }, { where: { id: userId }, transaction });
      });
    } catch (error) {
      Logger.error(`Transaction rolled back - ${error.message}`);
      throw new ApiError(error);
    }
  },

  /**
   * Bulk sends emails to multiple users.
   * This is done by creating the emails in the database, and then sending them one
   * by one to each user individually.
   *
   * @param {object} param - The parameter object.
   * @param {object[]} param.emailsData - The list of email data objects.
   * @param {string} param.emailsData[].userId - The ID of the user.
   * @param {string} param.emailsData[].subject - The subject of the email.
   * @param {string} param.emailsData[].body - The body of the email.
   * @returns {Promise<void>} - A promise that resolves when all emails are sent.
   */
  async sendMany({ emailsData }) {
    const createdEmails = await Email.bulkCreate(emailsData, { include: User, returning: true });

    const receipients = await User.findAll({
      where: { id: emailsData.map((email) => email.userId) },
      attributes: ['id', 'email'],
    });

    const userEmailMap = new Map(receipients.map((user) => [user.id, user.email]));

    createdEmails.forEach(async (email) => {
      try {
        await EmailSenderService.sendOne({
          to: userEmailMap.get(email.userId),
          subject: email.subject,
          body: email.body,
        });

        email.isDelivered = true;
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        return; // continue to the next email if an error occurs.
      }
    });

    const deliveredEmails = createdEmails.filter((email) => email.isDelivered);

    const updatedEmailIds = deliveredEmails.map((email) => email.id);
    await Email.update({ isDelivered: true }, { where: { id: updatedEmailIds } });

    const receipientsUserIds = deliveredEmails.map((email) => email.userId);
    await User.update({ lastEmailedAt: new Date().toISOString() }, { where: { id: receipientsUserIds } });
  },

  /**
   * Fetches all emails from the database.
   * This can only be done by an authenticated user.
   * @returns {Promise<Email[]>} The list of emails.
   */
  async getAll() {
    const emails = await Email.findAll();
    return emails;
  },

  /**
   * Fetches all emails related to a specific user.
   * This can only be done by an authenticated user.
   * @returns {Promise<Email[]>} The list of emails.
   */
  async getByUser({ userId }) {
    const userEmails = await Email.findAll({ where: { userId } });
    return userEmails;
  },

  /**
   * Sends a welcome email to the user.
   * This is done when the user is created.
   * @param {object} param - The parameter object.
   * @param {string} param.to - The ID of the user.
   * @returns {Promise<void>} The list of emails.
   */
  async sendWelcomeEmail({ to }) {
    const emailDetails = {
      subject: 'Welcome!',
      body: `
      <p>We will send you weekly emails to let you know that you're doing great.</p>
      <p>Our motivational messages are delivered every <strong>Sunday, 12:00 PM Local Cairo Time</strong>.</p>
      <p>Stay tuned!</p>
      <p>Warmly, Your motivational best friend.</p>
    `,
    };

    await this.send({
      userId: to,
      ...emailDetails,
    });
  },

  async sendMotivationalEmails() {
    const receipients = await User.findAll({ where: { isSubscribed: true } });

    Logger.info(`Sending motivational emails to ${receipients.length} users.`);
    const message = await AIIntegrationService.getMotivationalMessage();

    const emailsData = [];

    receipients.forEach(async (user) => {
      const body =
        `
      <p>${message}</p>
      <p>Wishing you a wonderful week,</p>
      <p>Bestie - an automated email sender.</p>
        ` + this.getUnsubscribeSignOff({ userId: user.id });

      emailsData.push({
        userId: user.id,
        subject: 'Your weekly motivational email is here!',
        body,
      });
    });

    return await this.sendMany({ emailsData });
  },

  async sendBirthdayEmails() {
    const receipientsBirthdayToday = await User.findAll({
      where: Sequelize.literal(`
          EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM NOW()) 
          AND EXTRACT(DAY FROM birthday) = EXTRACT(DAY FROM NOW())
          AND "isSubscribed" = true
        `),

      attributes: ['id', 'birthday', 'name'],
    });

    if (!receipientsBirthdayToday.length) {
      Logger.info('No users have birthdays today.');
      return;
    }

    Logger.info(`Sending birthday emails to ${receipientsBirthdayToday.length} users.`);
    const message = await AIIntegrationService.getBirthdayMessage();

    const emailsData = [];

    receipientsBirthdayToday.forEach(async (user) => {
      const body =
        `
      <p>${user.name}, today is a very special day 🎂.</p>
      <p>${message}</p>
      <p>All the best,</p>
      <p>Bestie - an automated email sender.</p>
    ` + this.getUnsubscribeSignOff({ userId: user.id });

      emailsData.push({
        userId: user.id,
        subject: `Happy Birthday, ${user.name}! Today you're ${calculateAge(user.birthday)} years old 🎉.`,
        body,
      });
    });

    return await this.sendMany({ emailsData });
  },

  /**
   * Generates an unsubscribe URL for the user.
   * This is done by signing a JWT token with the user's ID, and appending it as a query param to the link which
   * calls the app to unsubscribe the user from the email.
   * @param {object} param - The parameter object.
   * @param {string} param.userId - The ID of the user.
   * @returns {string} The unsubscribe URL.
   */
  getUnsubscribeSignOff({ userId }) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const unsubscribeLink = `${process.env.BASE_URL}/api/v1/users/unsubscribe?token=${token}`;
    return `<p>To unsubscribe, <a href="${unsubscribeLink}" target="_blank">click here</a>.</p>`;
  },
};
