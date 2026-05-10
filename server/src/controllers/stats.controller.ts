import { Response } from 'express';
import { Tool } from '../models/Tool.model';
import { AuthRequest } from '../types';
import { handleError, sendSuccess } from '../utils/errors';

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
