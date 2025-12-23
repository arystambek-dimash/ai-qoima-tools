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
  console.log(`[Worker] Starting news collection job ${job.id || 'unknown'}...`);
  
  // Handle cases where job.data might be undefined (scheduled jobs or older format)
  const jobData = job.data || { triggeredBy: 'scheduled', triggeredAt: new Date().toISOString() };
  console.log(`[Worker] Triggered by: ${jobData.triggeredBy} at ${jobData.triggeredAt}`);

  try {
    const result = await collectNews();
    const duration = Date.now() - startTime;

    console.log(`[Worker] News collection completed in ${duration}ms:`, result);
    jobsProcessed++;

    // Automatically trigger article generation for all news without content
    if (result.saved > 0) {
      console.log(`[Worker] Triggering batch article generation for ${result.saved} new news items...`);
      const queue = await getJobQueue();
      await queue.send(JobNames.ARTICLE_GENERATION_BATCH, {
        limit: result.saved + 5, // Generate for new + any previously missed
        triggeredBy: 'auto',
      });
    }

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
  const jobData = job.data || { newsId: '', triggeredBy: 'unknown' };
  const newsId = jobData.newsId;
  
  if (!newsId) {
    console.error('[Worker] Article generation job missing newsId');
    return { newsId: '', success: false, error: 'Missing newsId' };
  }
  
  console.log(`[Worker] Starting article generation for news ${newsId}...`);

  try {
    const result = await generateArticleContent(newsId);
    jobsProcessed++;

    if (result) {
      console.log(`[Worker] Article generated successfully for ${newsId}`);
      return {
        newsId,
        success: true,
      };
    } else {
      return {
        newsId,
        success: false,
        error: 'Generation returned null',
      };
    }
  } catch (error) {
    console.error(`[Worker] Article generation failed for ${newsId}:`, error);
    return {
      newsId,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function handleArticleGenerationBatch(
  job: Job<ArticleGenerationBatchJobData>
): Promise<{ generated: number; limit: number }> {
  const jobData = job.data || { limit: 10, triggeredBy: 'unknown' };
  const limit = jobData.limit || 10;
  
  console.log(`[Worker] Starting batch article generation (limit: ${limit})...`);

  try {
    const generated = await generateMissingArticles(limit);
    jobsProcessed++;

    console.log(`[Worker] Batch article generation completed: ${generated}/${limit}`);
    return {
      generated,
      limit,
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
