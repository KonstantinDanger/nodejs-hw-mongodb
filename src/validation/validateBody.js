import createHttpError from 'http-errors';

export const validateBody = (validationSchema) => async (req, res, next) => {
  try {
    await validationSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (e) {
    const error = createHttpError(400, 'Bad Request', {
      errors: e.details,
    });
    next(error);
  }
};
