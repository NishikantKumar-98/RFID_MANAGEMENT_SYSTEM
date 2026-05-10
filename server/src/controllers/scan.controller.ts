import { Response } from 'express';
import { Tool } from '../models/Tool.model';
import { scanSchema } from '../validators/tool.validator';
import { AuthRequest } from '../types';
import { handleError, sendSuccess, ApiError } from '../utils/errors';

export const scanTools = async (req: AuthRequest, res: Response) => {
  try {
    const validation = scanSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ApiError(400, validation.error.errors[0].message);
    }

    const { scannedIds } = validation.data;
    const allTools = await Tool.find();
    const toolIdSet = new Set(allTools.map(t => t.toolId));
    const scannedIdSet = new Set(scannedIds);

    const missing: string[] = [];
    for (const tool of allTools) {
      if (!scannedIdSet.has(tool.toolId) && tool.status === 'Issued') {
        missing.push(tool.toolId);
        await Tool.findOneAndUpdate({ toolId: tool.toolId }, { status: 'Missing' });
      }
    }

    const extra = scannedIds.filter(id => !toolIdSet.has(id));
    const correct = scannedIds.filter(id => toolIdSet.has(id));

    sendSuccess(res, { correct, missing, extra });
  } catch (error) {
    handleError(error, res);
  }
};
