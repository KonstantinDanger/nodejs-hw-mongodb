import createHttpError from 'http-errors';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  SESSION_ID_COOKIE_KEY,
} from '../constants.js';

import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie(REFRESH_TOKEN_COOKIE_KEY, session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie(SESSION_ID_COOKIE_KEY, session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  console.log('session in controller:', session);
  setupSession(res, session);

  res.status(200).json({
    message: 'Successfuly logged in',
    data: { accessToken: session.accessToken },
  });
};

export const refreshUserController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.status(200).json({
    message: 'Successfuly refreshed a session',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie(SESSION_ID_COOKIE_KEY);
  res.clearCookie(REFRESH_TOKEN_COOKIE_KEY);

  res.status(204).send();
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);
  } catch {
    next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
  }

  res.status(200).json({
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.status(200).json({
    message: 'Password was successfully reset!',
    data: {},
  });
};
