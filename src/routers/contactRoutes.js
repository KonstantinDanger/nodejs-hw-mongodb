import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { Router } from 'express';

import {
  createContactController,
  deleteContactController,
  getContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';

import { validateBody } from '../validation/validateBody.js';
import {
  createContactsSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();
router.get('/contacts', ctrlWrapper(getContactsController));
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/contacts',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
