import { Router } from 'express';
import { createTool, getAllTools } from '../controllers/tool.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createTool);
router.get('/', authMiddleware, getAllTools);

export default router;
