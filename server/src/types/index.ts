import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
