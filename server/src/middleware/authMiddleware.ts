import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../services/tokenService';
import { User } from '../models/User';

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized: No token provided' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ success: false, message: 'Not authorized: User no longer exists' });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error('[AuthMiddleware] Token verification failed:', error.message);
    res.status(401).json({ success: false, message: 'Not authorized: Token expired or invalid' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'guest'}' does not have access to this resource`,
      });
      return;
    }
    next();
  };
};
