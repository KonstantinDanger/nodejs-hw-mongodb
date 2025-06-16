import createHttpError from 'http-errors';
import getEnvVar from '../utils/getEnvVar.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { randomBytes } from 'crypto';
import { UsersCollection } from '../models/user.js';
import { SessionsCollection } from '../models/session.js';
import { FIFTEEN_MINUTES, JWT_SECRET, ONE_DAY, SMTP } from '../constants.js';
import { sendEmail } from '../utils/sendEmail.js';

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

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar(JWT_SECRET),
    {
      expiresIn: '15m',
    },
  );

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset password',
    html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
  });
};
