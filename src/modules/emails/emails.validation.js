import Joi from 'joi';

export const createEmailValidationSchema = Joi.object({
  userId: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
    'string.empty': 'User ID is required',
    'string.uuid': 'Valid UUID is required',
  }),
  subject: Joi.string().trim().required().messages({
    'string.empty': 'Email subject is required',
    'string.trim': 'Email subject cannot be empty',
  }),
  body: Joi.string().trim().required().messages({
    'string.empty': 'Email body is required',
    'string.trim': 'Email body cannot be empty',
  }),
  includeUnsubscribe: Joi.boolean().optional(),
});
