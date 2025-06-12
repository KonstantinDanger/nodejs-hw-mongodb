import createHttpError from 'http-errors';
import { ContactsCollection } from '../models/contact';

export const checkUserId = () => async (req, res, next) => {
  const { user } = req;
  if (!user) {
    next(createHttpError(401));
    return;
  }

  const contact = ContactsCollection.findOne({ _id: user._id });

  if (contact) {
    next();
    return;
  }

  next(createHttpError(403));
};
