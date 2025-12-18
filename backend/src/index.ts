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
import { startJobQueue } from './services/jobQueue.js';

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

// Start server
async function startServer() {
  try {
    // Initialize job queue connection (for enqueueing jobs)
    // Note: The actual job processing happens in the worker process
    await startJobQueue();
    console.log('Job queue initialized (main server can now enqueue jobs)');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/v1`);
      console.log('');
      console.log('IMPORTANT: Start the background worker in a separate terminal:');
      console.log('  npm run worker');
      console.log('');

      // Initialize cron jobs (scheduler - just enqueues jobs)
      initCronJobs();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
