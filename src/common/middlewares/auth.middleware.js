import { config } from 'dotenv';
import { StatusCodes } from 'http-status-codes';

config();

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing API key' });
  }

  const key = token.replace('Bearer ', '');

  if (key !== process.env.API_KEY) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid API key' });
  }

  next();
};
