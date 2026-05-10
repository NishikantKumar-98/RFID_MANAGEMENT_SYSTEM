import { Router } from 'express';
import { returnTool } from '../controllers/return.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, returnTool);

export default router;
