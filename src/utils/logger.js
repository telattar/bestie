import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, align } = format;

const Logger = createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'DD-MM-YYYY hh:mm:ss.S A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default Logger;
