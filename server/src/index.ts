import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { ApiError, handleError } from './utils/errors.js';

import authRoutes from './routes/auth.routes.js';
import toolRoutes from './routes/tool.routes.js';
import issueRoutes from './routes/issue.routes.js';
import returnRoutes from './routes/return.routes.js';
import scanRoutes from './routes/scan.routes.js';
import statsRoutes from './routes/stats.routes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/issue', issueRoutes);
app.use('/api/return', returnRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  handleError(err, res);
});

const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
