import { Response } from 'express';
import { ApiResponse } from '../types';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleError = (error: any, res: Response) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error.name === 'ValidationError' || error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: error.errors?.[0]?.message || 'Validation failed',
    });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

export const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};
