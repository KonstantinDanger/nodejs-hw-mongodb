import { register } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  const user = await register(req.body);

  res.status(201).json({
    message: 'Successfully registered a user!',
    data: user,
  });
};
