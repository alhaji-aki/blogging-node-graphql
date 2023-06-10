import jwt from 'jsonwebtoken';
import User from '../models/User';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.APP_KEY,
    { expiresIn: process.env.AUTH_EXPIRES_IN },
  );
}

export async function getAuthenticatedUser(req: any): Promise<typeof User> {
  const token = (req.headers.authorization || '').split('Bearer ')[1];

  if (!token) {
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.APP_KEY);

    return await User.findById(payload.id);
  } catch (error) {
    return;
  }
}
