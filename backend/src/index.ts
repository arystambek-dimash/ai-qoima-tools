import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { errorHandler } from './middleware/errorHandler.js';
import useCasesRouter from './routes/useCases.js';
import toolsRouter from './routes/tools.js';
import promptsRouter from './routes/prompts.js';
import newsRouter from './routes/news.js';
import subscribersRouter from './routes/subscribers.js';
import aiRouter from './routes/ai.js';
import adminRouter from './routes/admin/index.js';
import { initCronJobs } from './services/cronJobs.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/use-cases', useCasesRouter);
app.use('/api/v1/tools', toolsRouter);
app.use('/api/v1/prompts', promptsRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/subscribers', subscribersRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/admin', adminRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/v1`);

  // Initialize cron jobs for automated news collection
  initCronJobs();
});

export default app;
