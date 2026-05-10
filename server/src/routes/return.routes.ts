import { Router } from 'express';
import { returnTool } from '../controllers/return.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, returnTool);

export default router;
