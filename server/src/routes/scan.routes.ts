import { Router } from 'express';
import { scanTools } from '../controllers/scan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, scanTools);

export default router;
