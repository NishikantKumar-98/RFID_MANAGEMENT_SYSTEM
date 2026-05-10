import { Response } from 'express';
import { Tool } from '../models/Tool.model';
import { Transaction } from '../models/Transaction.model';
import { issueToolSchema } from '../validators/tool.validator';
import { AuthRequest } from '../types';
import { handleError, sendSuccess, ApiError } from '../utils/errors';

export const issueTool = async (req: AuthRequest, res: Response) => {
  try {
    const validation = issueToolSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ApiError(400, validation.error.errors[0].message);
    }

    const { toolId, userId } = validation.data;
    const tool = await Tool.findOne({ toolId });
    
    if (!tool) {
      throw new ApiError(404, 'Tool not found');
    }
    if (tool.status !== 'Available') {
      throw new ApiError(400, 'Tool is not available');
    }

    tool.status = 'Issued';
    await tool.save();
    await Transaction.create({ toolId, userId, type: 'Issue', timestamp: new Date() });

    sendSuccess(res, { message: 'Tool issued successfully', tool });
  } catch (error) {
    handleError(error, res);
  }
};
