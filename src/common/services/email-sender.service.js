import { config } from 'dotenv';
import { createTransport } from 'nodemailer';
import Logger from '../../utils/logger.js';
import { ApiError } from '../../classes/api-error.js';
import { StatusCodes } from 'http-status-codes';

config();
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.IS_EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const EmailSenderService = {
  /**
   * Uses nodemailer to send an email to the specified recipient.
   * @param {object} param - The parameter object.
   * @param {string} param.to - The email address of the recipient.
   * @param {string} param.subject - The subject of the email.
   * @param {string} param.body - The body of the email.
   * @returns {Promise<void>} - A promise that resolves when the email is sent.
   */
  async sendOne({ to, subject, body }) {
    await transporter
      .sendMail({
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        html: body,
      })
      .catch((error) => {
        Logger.error(`while sending email to ${to}: ${error}`);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error occurred while sending email.');
      });
  },
};
