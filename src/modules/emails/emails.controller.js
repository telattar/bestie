import { StatusCodes } from 'http-status-codes';
import { EmailsService } from './emails.service.js';

export const EmailsController = {
  async getEmails(req, res) {
    try {
      const emails = await EmailsService.getAll();
      return res.status(StatusCodes.OK).json({ emails });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  },

  async getUserEmails(req, res) {
    try {
      const { userId } = req.params;
      const emails = await EmailsService.getByUser(userId);
      return res.status(StatusCodes.OK).json({ emails });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  },

  async sendEmail(req, res) {
    try {
      const { userId, subject, body, includeUnsubscribe } = req.body;
      await EmailsService.send({ userId, subject, body, includeUnsubscribe });
      return res.status(StatusCodes.OK).json({ message: 'Email sent successfully.' });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  },
};
