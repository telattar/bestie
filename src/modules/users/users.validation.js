import Joi from 'joi';

export const createUserValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email is required',
    'string.empty': 'Email is required',
  }),
  birthday: Joi.date().optional(),
});

export const updateUserValidationSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    'string.empty': 'Name is required',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Valid email is required',
  }),
  birthday: Joi.date().optional(),
}).min(1);
