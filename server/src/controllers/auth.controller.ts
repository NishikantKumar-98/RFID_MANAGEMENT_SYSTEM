import { Response, Request } from 'express';
import { User } from '../models/User.model';
import { generateToken } from '../utils/jwt.utils';
import { handleError, sendSuccess, ApiError } from '../utils/errors';

export const login = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    let user = await User.findOne({ userId });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const token = generateToken(userId);
    sendSuccess(res, { token, user: { userId: user.userId, name: user.name } });
  } catch (error) {
    handleError(error, res);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { userId, name } = req.body;
    
    if (!userId || !name) {
      throw new ApiError(400, 'User ID and name are required');
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      throw new ApiError(409, 'User already exists');
    }

    const user = await User.create({ userId, name });
    const token = generateToken(userId);
    
    sendSuccess(res, { token, user: { userId: user.userId, name: user.name } }, 201);
  } catch (error) {
    handleError(error, res);
  }
};