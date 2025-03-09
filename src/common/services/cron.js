import cron from 'node-cron';
import Logger from '../../utils/logger.js';
import { EmailsService } from '../../modules/emails/emails.service.js';

/**
 * A cron job that sends motivational emails to all users every Sunday at 12 PM.
 * Local Cairo Time.
 */
export const motivationalEmailTask = cron.schedule(
  '00 12 * * Sun',
  async () => {
    try {
      Logger.info('weekly motivational email task is executing');
      await EmailsService.sendMotivationalEmails();
      Logger.info('weekly motivational emails sent successfully');
    } catch (error) {
      Logger.error(`Failed to send motivational emails: ${error.message}`);
    }
  },
  {
    name: 'motivational-email-task',
    scheduled: true,
    timezone: 'Africa/Cairo',
  }
);

/**
 * A cron job that sends birthday emails to users.
 * Runs everyday at midnight
 * Local Cairo Time.
 */
export const birthdayEmailTask = cron.schedule(
  '0 0 * * *',
  async () => {
    try {
      Logger.info('birthday email task is executing');
      await EmailsService.sendBirthdayEmails();
      Logger.info('birthday emails sent successfully');
    } catch (error) {
      Logger.error(`Failed to send birthday emails: ${error.message}`);
    }
  },
  {
    name: 'birthday-midnight-task',
    scheduled: true,
    timezone: 'Africa/Cairo',
  }
);
