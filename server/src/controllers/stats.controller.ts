import { Response } from 'express';
import { Tool } from '../models/Tool.model.js';
import { AuthRequest } from '../types/index.js';
import { handleError, sendSuccess } from '../utils/errors.js';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const total = await Tool.countDocuments();
    const issued = await Tool.countDocuments({ status: 'Issued' });
    const missing = await Tool.countDocuments({ status: 'Missing' });

    sendSuccess(res, { total, issued, missing });
  } catch (error) {
    handleError(error, res);
  }
};
