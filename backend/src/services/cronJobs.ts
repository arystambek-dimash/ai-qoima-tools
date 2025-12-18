import cron from 'node-cron';
import {
  enqueueJob,
  getJobStatus,
  getQueueStats,
  JobNames,
  NewsCollectionJobData,
  ArticleGenerationJobData,
  ArticleGenerationBatchJobData,
  JobStatus,
} from './jobQueue.js';

let lastScheduledJobId: string | null = null;
let lastScheduledTime: Date | null = null;

// Schedule a news collection job (non-blocking - just enqueues)
async function scheduleNewsCollection(triggeredBy: 'cron' | 'manual'): Promise<string | null> {
  const jobData: NewsCollectionJobData = {
    triggeredBy,
    triggeredAt: new Date().toISOString(),
  };

  const jobId = await enqueueJob(JobNames.NEWS_COLLECTION, jobData, {
    // Prevent duplicate jobs within 5 minutes
    singletonKey: 'news-collection-singleton',
    singletonSeconds: 300,
  });

  if (jobId) {
    lastScheduledJobId = jobId;
    lastScheduledTime = new Date();
    console.log(`[Cron] Scheduled news collection job: ${jobId}`);
  } else {
    console.log('[Cron] News collection job already in queue (singleton)');
  }

  return jobId;
}

// Get collection status
export async function getCollectionStatus(): Promise<{
  lastScheduledJobId: string | null;
  lastScheduledTime: string | null;
  lastJobStatus: {
    id: string;
    state: string;
    output: unknown;
    startedOn: Date | null;
    completedOn: Date | null;
  } | null;
  queueStats: {
    created: number;
    retry: number;
    active: number;
    completed: number;
    failed: number;
  };
  nextScheduledRun: string;
}> {
  let lastJobStatus: JobStatus | null = null;
  if (lastScheduledJobId) {
    lastJobStatus = await getJobStatus(lastScheduledJobId);
  }

  const queueStats = await getQueueStats(JobNames.NEWS_COLLECTION);

  return {
    lastScheduledJobId,
    lastScheduledTime: lastScheduledTime?.toISOString() || null,
    lastJobStatus: lastJobStatus ? {
      id: lastJobStatus.id,
      state: lastJobStatus.state,
      output: lastJobStatus.output,
      startedOn: lastJobStatus.startedon,
      completedOn: lastJobStatus.completedon,
    } : null,
    queueStats,
    nextScheduledRun: getNextScheduledRun(),
  };
}

// Calculate next scheduled run time
function getNextScheduledRun(): string {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(nextHour.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);
  return nextHour.toISOString();
}

// Manual trigger - enqueues job and returns immediately
export async function triggerNewsCollection(): Promise<{
  success: boolean;
  message: string;
  jobId?: string | null;
}> {
  try {
    const jobId = await scheduleNewsCollection('manual');

    if (jobId) {
      return {
        success: true,
        message: 'News collection job queued successfully. It will run in background.',
        jobId,
      };
    } else {
      return {
        success: false,
        message: 'A news collection job is already queued or running. Please wait.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to queue news collection: ${error}`,
    };
  }
}

// Queue article generation for a specific news item
export async function triggerArticleGeneration(newsId: string): Promise<{
  success: boolean;
  message: string;
  jobId?: string | null;
}> {
  try {
    const jobData: ArticleGenerationJobData = {
      newsId,
      triggeredBy: 'manual',
    };

    const jobId = await enqueueJob(JobNames.ARTICLE_GENERATION, jobData);

    if (jobId) {
      return {
        success: true,
        message: 'Article generation job queued successfully.',
        jobId,
      };
    } else {
      return {
        success: false,
        message: 'Failed to queue article generation job.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to queue article generation: ${error}`,
    };
  }
}

// Queue batch article generation
export async function triggerBatchArticleGeneration(limit: number): Promise<{
  success: boolean;
  message: string;
  jobId?: string | null;
}> {
  try {
    const jobData: ArticleGenerationBatchJobData = {
      limit,
      triggeredBy: 'manual',
    };

    const jobId = await enqueueJob(JobNames.ARTICLE_GENERATION_BATCH, jobData, {
      // Prevent duplicate batch jobs
      singletonKey: 'article-batch-singleton',
      singletonSeconds: 60,
    });

    if (jobId) {
      return {
        success: true,
        message: `Batch article generation job queued (limit: ${limit}).`,
        jobId,
      };
    } else {
      return {
        success: false,
        message: 'A batch article generation job is already queued. Please wait.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to queue batch article generation: ${error}`,
    };
  }
}

// Initialize cron jobs (scheduler only - doesn't process jobs)
export function initCronJobs(): void {
  console.log('[Cron] Initializing job scheduler...');

  // Schedule news collection every hour at minute 0
  // This just enqueues the job - the worker processes it
  cron.schedule('0 * * * *', async () => {
    console.log(`[Cron] Hourly trigger - scheduling news collection...`);
    await scheduleNewsCollection('cron');
  });

  console.log('[Cron] Job scheduler initialized:');
  console.log('  - News collection: Every hour at :00 (queues job for worker)');

  // Queue initial collection after 30 seconds
  setTimeout(async () => {
    console.log('[Cron] Scheduling initial news collection...');
    await scheduleNewsCollection('cron');
  }, 30000);
}

export default {
  initCronJobs,
  triggerNewsCollection,
  triggerArticleGeneration,
  triggerBatchArticleGeneration,
  getCollectionStatus,
};
