import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
} from '../validation/auth.js';
import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshUserController,
  registerUserController,
  requestResetEmailController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../validation/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserController));

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

// router.post('/reset-pwd', ctrlWrapper());
export default router;
