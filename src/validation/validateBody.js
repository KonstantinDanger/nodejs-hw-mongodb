import createHttpError from 'http-errors';
import { createContactsSchema } from './contacts.js';

export const validateBody = (validationSchema) => async (req, res, next) => {
  try {
    await createContactsSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (e) {
    const error = createHttpError(400, 'Bad Request', {
      errors: e.details,
    });
    next(error);
  }
};
