import { Router } from 'express';
import { issueTool } from '../controllers/issue.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, issueTool);

export default router;
