import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

import {startWorker, getWorkerStatus} from './services/jobWorker.js';
import {startJobQueue, getQueueStats, JobNames, scheduleHourlyNewsCollection, getScheduleInfo} from './services/jobQueue.js';

const WORKER_PORT = parseInt(process.env.WORKER_PORT || '3002');

// Create a simple HTTP server for health checks
function createHealthServer(): http.Server {
    const server = http.createServer(async (req, res) => {
        if (req.url === '/health' && req.method === 'GET') {
            try {
                const status = getWorkerStatus();
                const queueStats = await getQueueStats(JobNames.NEWS_COLLECTION).catch(() => null);
                const schedules = await getScheduleInfo().catch(() => []);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: status.isRunning ? 'healthy' : 'unhealthy',
                    timestamp: new Date().toISOString(),
                    worker: {
                        isRunning: status.isRunning,
                        startTime: status.startTime,
                        jobsProcessed: status.jobsProcessed,
                        uptime: Math.round(status.uptime / 1000),
                    },
                    queue: queueStats,
                    schedules,
                    memory: {
                        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                    },
                }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'error', 
                    error: error instanceof Error ? error.message : 'Unknown error' 
                }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    });
    
    return server;
}

async function main(): Promise<void> {
    console.log('='.repeat(60));
    console.log('Starting Background Worker');
    console.log('='.repeat(60));
    console.log(`PID: ${process.pid}`);
    console.log(`Database: ${process.env.POSTGRES_DB}@${process.env.POSTGRES_HOST}`);
    console.log(`Health endpoint: http://localhost:${WORKER_PORT}/health`);
    console.log('='.repeat(60));

    try {
        // Initialize the job queue connection
        await startJobQueue();

        // Start processing jobs
        await startWorker();

        // Schedule hourly news collection
        await scheduleHourlyNewsCollection();
        console.log('[Worker] Hourly news collection scheduled');

        // Start health check server
        const healthServer = createHealthServer();
        healthServer.listen(WORKER_PORT, () => {
            console.log(`[Worker] Health server listening on port ${WORKER_PORT}`);
        });

        console.log('');
        console.log('Worker is running and waiting for jobs...');
        console.log('Press Ctrl+C to stop');
        console.log('');

        // Log status every 60 seconds
        setInterval(() => {
            const status = getWorkerStatus();
            console.log(`[Worker Status] Uptime: ${Math.round(status.uptime / 1000)}s | Jobs processed: ${status.jobsProcessed}`);
        }, 60000);

    } catch (error) {
        console.error('Failed to start worker:', error);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

main();
