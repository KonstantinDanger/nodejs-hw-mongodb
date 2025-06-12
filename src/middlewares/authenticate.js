import createHttpError from 'http-errors';
import { SessionsCollection } from '../models/session.js';
import { UsersCollection } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const header = req.get('Authorization');

  if (!header) {
    next(createHttpError(401, 'Authorization header is missing'));
  }

  const bearer = header.split(' ')[0];
  const accessToken = header.split(' ')[1];

  if (!bearer || bearer !== 'Bearer') {
    next(createHttpError(401, 'Authorization header should be of type Bearer'));
    return;
  }

  const session = await SessionsCollection.findOne({
    accessToken: accessToken,
  });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const hasExpired = new Date() > new Date(session.accessTokenValidUntil);

  if (hasExpired) {
    next(createHttpError(401, 'Access token has expired'));
    return;
  }

  const user = await UsersCollection.findById(session.userId);
  console.log(
    'user---------------------------------------------------------',
    user,
  );

  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;

  next();
};
