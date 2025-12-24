import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import {errorHandler} from './middleware/errorHandler.js';
import useCasesRouter from './routes/useCases.js';
import toolsRouter from './routes/tools.js';
import promptsRouter from './routes/prompts.js';
import newsRouter from './routes/news.js';
import subscribersRouter from './routes/subscribers.js';
import aiRouter from './routes/ai.js';
import adminRouter from './routes/admin/index.js';
import authRouter from './routes/auth.js';
import {initCronJobs} from './services/cronJobs.js';
import {startJobQueue, getQueueStats, JobNames} from './services/jobQueue.js';
import {getPoolStats} from './db/index.js';

// Validate required environment variables
const requiredEnvVars = ['PORT', 'POSTGRES_USER', 'POSTGRES_PASS', 'POSTGRES_HOST', 'POSTGRES_DB'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT;

// Configure CORS with specific origins for security
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://admin.localhost:3000',
    "https://qoima.com.kz",
    "https://admin.qoima.com.kz",
    "http://qoima.com.kz",
    "http://admin.qoima.com.kz",
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        if (allowedOrigins.some(allowed => origin.startsWith(allowed.replace(/:\d+$/, '')))) {
            return callback(null, true);
        }
        
        // In development, allow localhost variants
        if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());

// Enhanced health check endpoint
app.get('/health', async (_req, res) => {
    try {
        const poolStats = getPoolStats();
        const queueStats = await getQueueStats(JobNames.NEWS_COLLECTION).catch(() => null);
        
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            },
            database: {
                connections: poolStats.totalConnections,
                idle: poolStats.idleConnections,
                waiting: poolStats.waitingClients,
            },
            queue: queueStats,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

app.use('/api/v1/use-cases', useCasesRouter);
app.use('/api/v1/tools', toolsRouter);
app.use('/api/v1/prompts', promptsRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/subscribers', subscribersRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/auth', authRouter);

app.use((_req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found',
        },
    });
});

app.use(errorHandler);

async function startServer() {
    try {
        // Initialize job queue for enqueueing jobs
        await startJobQueue();
        console.log('Job queue initialized (main server can now enqueue jobs)');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api/v1`);
            console.log('');
            console.log('IMPORTANT: Start the background worker in a separate terminal:');
            console.log('  npm run worker');
            console.log('');
            initCronJobs();
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;
