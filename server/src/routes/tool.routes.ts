import { Router } from 'express';
import { createTool, getAllTools } from '../controllers/tool.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createTool);
router.get('/', authMiddleware, getAllTools);

export default router;
