import { Router } from 'express';
import { validate } from '../../common/middlewares/validation.middleware.js';
import { createUserValidationSchema, updateUserValidationSchema } from './users.validation.js';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, UsersController.getUsers);

// This route will be used to create a new user and subscribe them to the email list.
// allowing only authenticated users to create new users.
router.post('/', authenticate, validate(createUserValidationSchema), UsersController.createUser);

router.patch('/:id', authenticate, validate(updateUserValidationSchema), UsersController.updateUser);

// This route will be clickable in the email to allow users to unsubscribe from the email list.
router.get('/unsubscribe', UsersController.unsubscribeFromEmails);

export { router as UserRouter };
