import {
  startJobQueue,
  stopJobQueue,
  getJobQueue,
  JobNames,
  NewsCollectionJobData,
  ArticleGenerationJobData,
  ArticleGenerationBatchJobData,
  FetchFromXJobData,
  NewsCollectionResult,
  ArticleGenerationResult,
} from './jobQueue.js';
import { collectNews } from './newsCollector.js';
import { generateArticleContent, generateMissingArticles } from './articleGenerator.js';

// Track worker state
let isRunning = false;
let workerStartTime: Date | null = null;
let jobsProcessed = 0;

// Generic job type for handlers
interface Job<T> {
  id: string;
  data: T;
}

// Job handlers
async function handleNewsCollection(
  job: Job<NewsCollectionJobData>
): Promise<NewsCollectionResult> {
  const startTime = Date.now();
  console.log(`[Worker] Starting news collection job ${job.id}...`);
  console.log(`[Worker] Triggered by: ${job.data.triggeredBy} at ${job.data.triggeredAt}`);

  try {
    const result = await collectNews();
    const duration = Date.now() - startTime;

    console.log(`[Worker] News collection completed in ${duration}ms:`, result);
    jobsProcessed++;

    return {
      ...result,
      duration,
    };
  } catch (error) {
    console.error(`[Worker] News collection failed:`, error);
    throw error; // This will trigger retry
  }
}

async function handleArticleGeneration(
  job: Job<ArticleGenerationJobData>
): Promise<ArticleGenerationResult> {
  console.log(`[Worker] Starting article generation for news ${job.data.newsId}...`);

  try {
    const result = await generateArticleContent(job.data.newsId);
    jobsProcessed++;

    if (result) {
      console.log(`[Worker] Article generated successfully for ${job.data.newsId}`);
      return {
        newsId: job.data.newsId,
        success: true,
      };
    } else {
      return {
        newsId: job.data.newsId,
        success: false,
        error: 'Generation returned null',
      };
    }
  } catch (error) {
    console.error(`[Worker] Article generation failed for ${job.data.newsId}:`, error);
    return {
      newsId: job.data.newsId,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function handleArticleGenerationBatch(
  job: Job<ArticleGenerationBatchJobData>
): Promise<{ generated: number; limit: number }> {
  console.log(`[Worker] Starting batch article generation (limit: ${job.data.limit})...`);

  try {
    const generated = await generateMissingArticles(job.data.limit);
    jobsProcessed++;

    console.log(`[Worker] Batch article generation completed: ${generated}/${job.data.limit}`);
    return {
      generated,
      limit: job.data.limit,
    };
  } catch (error) {
    console.error(`[Worker] Batch article generation failed:`, error);
    throw error;
  }
}

async function handleFetchFromX(
  job: Job<FetchFromXJobData>
): Promise<{ success: boolean; fetched?: number; error?: string }> {
  console.log(`[Worker] Starting fetch from X job ${job.id}...`);

  // Note: This would need to import and call the Grok fetch logic
  // For now, we'll just return a placeholder
  // The actual implementation can be moved from the admin route
  jobsProcessed++;

  return {
    success: true,
    fetched: 0,
  };
}

// Start the worker
export async function startWorker(): Promise<void> {
  if (isRunning) {
    console.log('[Worker] Worker is already running');
    return;
  }

  console.log('[Worker] Starting job worker...');

  try {
    const boss = await getJobQueue();
    isRunning = true;
    workerStartTime = new Date();

    // Register job handlers with concurrency control
    // Only process 1 news collection job at a time to avoid overwhelming the server
    await boss.work(
      JobNames.NEWS_COLLECTION,
      { teamSize: 1, teamConcurrency: 1 },
      handleNewsCollection as any
    );

    // Allow up to 2 concurrent article generation jobs
    await boss.work(
      JobNames.ARTICLE_GENERATION,
      { teamSize: 2, teamConcurrency: 1 },
      handleArticleGeneration as any
    );

    // Batch generation should be single-threaded
    await boss.work(
      JobNames.ARTICLE_GENERATION_BATCH,
      { teamSize: 1, teamConcurrency: 1 },
      handleArticleGenerationBatch as any
    );

    // Fetch from X - single threaded
    await boss.work(
      JobNames.FETCH_FROM_X,
      { teamSize: 1, teamConcurrency: 1 },
      handleFetchFromX as any
    );

    console.log('[Worker] Job handlers registered:');
    console.log(`  - ${JobNames.NEWS_COLLECTION} (concurrency: 1)`);
    console.log(`  - ${JobNames.ARTICLE_GENERATION} (concurrency: 2)`);
    console.log(`  - ${JobNames.ARTICLE_GENERATION_BATCH} (concurrency: 1)`);
    console.log(`  - ${JobNames.FETCH_FROM_X} (concurrency: 1)`);

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('[Worker] Received SIGTERM, shutting down gracefully...');
      await stopWorker();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('[Worker] Received SIGINT, shutting down gracefully...');
      await stopWorker();
      process.exit(0);
    });

  } catch (error) {
    console.error('[Worker] Failed to start worker:', error);
    throw error;
  }
}

// Stop the worker
export async function stopWorker(): Promise<void> {
  if (!isRunning) {
    console.log('[Worker] Worker is not running');
    return;
  }

  console.log('[Worker] Stopping job worker...');
  await stopJobQueue();
  isRunning = false;
  console.log('[Worker] Worker stopped');
}

// Get worker status
export function getWorkerStatus(): {
  isRunning: boolean;
  startTime: string | null;
  jobsProcessed: number;
  uptime: number;
} {
  return {
    isRunning,
    startTime: workerStartTime?.toISOString() || null,
    jobsProcessed,
    uptime: workerStartTime ? Date.now() - workerStartTime.getTime() : 0,
  };
}

export default {
  startWorker,
  stopWorker,
  getWorkerStatus,
};
