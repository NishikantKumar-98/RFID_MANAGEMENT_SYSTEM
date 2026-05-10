import { Response } from 'express';
import { Tool } from '../models/Tool.model';
import { Transaction } from '../models/Transaction.model';
import { returnToolSchema } from '../validators/tool.validator';
import { AuthRequest } from '../types';
import { handleError, sendSuccess, ApiError } from '../utils/errors';

export const returnTool = async (req: AuthRequest, res: Response) => {
  try {
    const validation = returnToolSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ApiError(400, validation.error.errors[0].message);
    }

    const { toolId } = validation.data;
    const tool = await Tool.findOne({ toolId });
    
    if (!tool) {
      throw new ApiError(404, 'Tool not found');
    }
    if (tool.status !== 'Issued') {
      throw new ApiError(400, 'Tool is not currently issued');
    }

    tool.status = 'Available';
    await tool.save();
    await Transaction.create({ toolId, userId: 'system', type: 'Return', timestamp: new Date() });

    sendSuccess(res, { message: 'Tool returned successfully', tool });
  } catch (error) {
    handleError(error, res);
  }
};
