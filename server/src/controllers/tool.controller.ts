import { Response } from 'express';
import { Tool } from '../models/Tool.model.js';
import { createToolSchema } from '../validators/tool.validator.js';
import { AuthRequest } from '../types/index.js';
import { handleError, sendSuccess, ApiError } from '../utils/errors.js';

export const createTool = async (req: AuthRequest, res: Response) => {
  try {
    const validation = createToolSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ApiError(400, validation.error.errors[0].message);
    }

    const { toolId, name, category } = validation.data;
    const existingTool = await Tool.findOne({ toolId });
    
    if (existingTool) {
      throw new ApiError(409, 'Tool ID already exists');
    }

    const tool = await Tool.create({
      toolId,
      name,
      category,
      status: 'Available',
    });

    sendSuccess(res, tool, 201);
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllTools = async (req: AuthRequest, res: Response) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 });
    sendSuccess(res, tools);
  } catch (error) {
    handleError(error, res);
  }
};
