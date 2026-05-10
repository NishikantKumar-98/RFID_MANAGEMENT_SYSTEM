import { Router } from 'express';
import { scanTools } from '../controllers/scan.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, scanTools);

export default router;
