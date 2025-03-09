import { config } from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { initializeDatabase } from './config/database.js';
import Logger from './utils/logger.js';
import { UserRouter } from './modules/users/users.router.js';
import { EmailRouter } from './modules/emails/emails.router.js';
import { birthdayEmailTask, motivationalEmailTask } from './common/services/cron.js';

config();

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const router = express.Router();
app.use((req, res, next) => {
  Logger.info(`Request: ${req.method} ${req.path} | Query: ${JSON.stringify(req.query)} | Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use('/api/v1', router);

const port = process.env.PORT || '8000';

try {
  await initializeDatabase();
  app.listen(port, () => {
    Logger.info(`App is listening on port ${port}`);
  });
} catch (error) {
  Logger.error(error);
}

motivationalEmailTask.start();
birthdayEmailTask.start();

router.use('/users', UserRouter);
router.use('/emails', EmailRouter);
