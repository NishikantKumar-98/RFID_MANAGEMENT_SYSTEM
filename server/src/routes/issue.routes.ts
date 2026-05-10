import { Router } from 'express';
import { issueTool } from '../controllers/issue.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, issueTool);

export default router;
