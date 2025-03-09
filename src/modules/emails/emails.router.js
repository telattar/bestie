import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware.js';
import { EmailsController } from './emails.controller.js';
import { validate } from '../../common/middlewares/validation.middleware.js';
import { createEmailValidationSchema } from './emails.validation.js';

const router = Router();

router.get('/', authenticate, EmailsController.getEmails);
router.post('/', authenticate, validate(createEmailValidationSchema), EmailsController.sendEmail);

export { router as EmailRouter };
