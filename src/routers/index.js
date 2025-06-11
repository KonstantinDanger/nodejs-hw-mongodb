import contactsRouter from './contactRoutes.js';
import authRouter from './authRoutes.js';

import { Router } from 'express';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
