import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import { handleError } from './utils/errors';

import authRoutes from './routes/auth.routes';
import toolRoutes from './routes/tool.routes';
import issueRoutes from './routes/issue.routes';
import returnRoutes from './routes/return.routes';
import scanRoutes from './routes/scan.routes';
import statsRoutes from './routes/stats.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Public utility routes that do not need the database.
app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'RFID Tool Management API is running' });
});

app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

// Vercel runs this file as a serverless function, so connect before API routes
// without starting a long-lived listener inside the function runtime.
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

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

if (!process.env.VERCEL) {
  startServer();
}

export default app;
