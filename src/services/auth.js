import bcrypt from 'bcrypt';
import { UsersCollection } from '../models/user.js';
import createHttpError from 'http-errors';

export const register = async (payload) => {
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
