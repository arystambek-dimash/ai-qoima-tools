import dotenv from 'dotenv';

dotenv.config();

import {startWorker, getWorkerStatus} from './services/jobWorker.js';
import {startJobQueue} from './services/jobQueue.js';

async function main(): Promise<void> {
    console.log('='.repeat(60));
    console.log('Starting Background Worker');
    console.log('='.repeat(60));
    console.log(`PID: ${process.pid}`);
    console.log(`Database: ${process.env.POSTGRES_DB}@${process.env.POSTGRES_HOST}`);
    console.log('='.repeat(60));

    try {
        // Initialize the job queue connection
        await startJobQueue();

        // Start processing jobs
        await startWorker();

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
