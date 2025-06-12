import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { randomBytes } from 'crypto';
import { UsersCollection } from '../models/user.js';
import { SessionsCollection } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants.js';

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const userExists = await UsersCollection.findOne({ email: email });

  if (userExists) {
    throw createHttpError(409, 'Such user already exists');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  return user;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await UsersCollection.findOne({ email: email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const session = createSession();

  const newSession = await SessionsCollection.create({
    userId: user._id,
    ...session,
  });

  return newSession;
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const hasExpired = new Date() > new Date(session.refreshTokenValidUntil);

  if (hasExpired) {
    throw createHttpError(401, 'Session token has expired');
  }

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  const updatedSession = await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });

  return updatedSession;
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const accessTokenExpirationDate = new Date(Date.now() + FIFTEEN_MINUTES);

  const refreshToken = randomBytes(30).toString('base64');
  const refreshTokenExpirationDate = new Date(Date.now() + ONE_DAY);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenValidUntil: accessTokenExpirationDate,
    refreshTokenValidUntil: refreshTokenExpirationDate,
  };
};
