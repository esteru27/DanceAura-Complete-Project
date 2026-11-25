import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (id: Types.ObjectId | string, role: string = 'student'): string => {
  const secret = process.env.JWT_SECRET || 'dance_aura_super_secure_jwt_secret_key_2026';
  return jwt.sign({ id: id.toString(), role }, secret, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || 'dance_aura_super_secure_jwt_secret_key_2026';
  return jwt.verify(token, secret);
};
