import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/errors.js';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, 'Internal server error');
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    req.user = decoded;
    next();
  } catch (error: any) {
    const statusCode = error instanceof ApiError ? error.statusCode : 401;
    const message = error instanceof ApiError ? error.message : 'Invalid token';
    res.status(statusCode).json({ success: false, error: message });
  }
};
