import { StatusCodes } from 'http-status-codes';

export const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Validation error: ' + error.details.map((detail) => detail.message.replace(/['"]/g, '')).join(', '),
    });
  }

  req.body = value; //use the validated value
  next();
};
