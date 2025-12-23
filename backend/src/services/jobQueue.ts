import { PgBoss } from 'pg-boss';
import dotenv from 'dotenv';

dotenv.config();

// Job names
export const JobNames = {
  NEWS_COLLECTION: 'news-collection',
  ARTICLE_GENERATION: 'article-generation',
  ARTICLE_GENERATION_BATCH: 'article-generation-batch',
  FETCH_FROM_X: 'fetch-from-x',
} as const;

export type JobName = typeof JobNames[keyof typeof JobNames];

// Job data types
export interface NewsCollectionJobData {
  triggeredBy: 'cron' | 'manual';
  triggeredAt: string;
}

export interface ArticleGenerationJobData {
  newsId: string;
  triggeredBy: 'cron' | 'manual';
}

export interface ArticleGenerationBatchJobData {
  limit: number;
  triggeredBy: 'manual';
}

export interface FetchFromXJobData {
  triggeredBy: 'manual';
}

// Job result types
export interface NewsCollectionResult {
  collected: number;
  saved: number;
  duration: number;
}

export interface ArticleGenerationResult {
  newsId: string;
  success: boolean;
  error?: string;
}

// Job status from pg-boss
export interface JobStatus {
  id: string;
  name: string;
  state: string;
  data: unknown;
  output: unknown;
  retrycount: number;
  startedon: Date | null;
  completedon: Date | null;
  createdon: Date;
}

// Build connection string
const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASS}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

// Create pg-boss instance - using any type due to pg-boss type exports
let boss: any = null;

export async function getJobQueue(): Promise<any> {
  if (boss) return boss;

  boss = new PgBoss({
    connectionString,
    // Archive completed jobs after 7 days
    archiveCompletedAfterSeconds: 7 * 24 * 60 * 60,
    // Delete archived jobs after 14 days
    deleteAfterSeconds: 14 * 24 * 60 * 60,
    // Retry failed jobs
    retryLimit: 3,
    retryDelay: 60, // 1 minute between retries
    // Monitor interval
    monitorStateIntervalSeconds: 30,
  });

  boss.on('error', (error: Error) => {
    console.error('[JobQueue] Error:', error);
  });

  boss.on('monitor-states', (states: unknown) => {
    console.log('[JobQueue] States:', JSON.stringify(states));
  });

  return boss;
}

export async function startJobQueue(): Promise<any> {
  const queue = await getJobQueue();
  await queue.start();
  console.log('[JobQueue] Started successfully');

  // Create queues if they don't exist
  await queue.createQueue(JobNames.NEWS_COLLECTION);
  await queue.createQueue(JobNames.ARTICLE_GENERATION);
  await queue.createQueue(JobNames.ARTICLE_GENERATION_BATCH);
  await queue.createQueue(JobNames.FETCH_FROM_X);
  console.log('[JobQueue] Queues initialized');

  return queue;
}

export async function stopJobQueue(): Promise<void> {
  if (boss) {
    await boss.stop({ graceful: true, timeout: 30000 });
    console.log('[JobQueue] Stopped gracefully');
    boss = null;
  }
}

// Helper to enqueue jobs
export async function enqueueJob<T extends object>(
  name: JobName,
  data: T,
  options?: object
): Promise<string | null> {
  const queue = await getJobQueue();
  const jobId = await queue.send(name, data, {
    retryLimit: 3,
    retryDelay: 60,
    ...options,
  });
  console.log(`[JobQueue] Enqueued job "${name}" with ID: ${jobId}`);
  return jobId;
}

// Get job status
export async function getJobStatus(jobId: string): Promise<JobStatus | null> {
  const queue = await getJobQueue();
  const job = await queue.getJobById(jobId);
  return job as JobStatus | null;
}

// Get queue statistics
export async function getQueueStats(name: JobName): Promise<{
  created: number;
  retry: number;
  active: number;
  completed: number;
  failed: number;
}> {
  const queue = await getJobQueue();
  const counts = await queue.getQueueSize(name, { includeStates: true });

  // getQueueSize returns a number or an object with states
  if (typeof counts === 'number') {
    return {
      created: counts,
      retry: 0,
      active: 0,
      completed: 0,
      failed: 0,
    };
  }

  const countsObj = counts as Record<string, number>;
  return {
    created: countsObj.created || 0,
    retry: countsObj.retry || 0,
    active: countsObj.active || 0,
    completed: countsObj.completed || 0,
    failed: countsObj.failed || 0,
  };
}

// Get recent jobs
export async function getRecentJobs(name: JobName, limit = 10): Promise<JobStatus[]> {
  const queue = await getJobQueue();
  // Use fetch to get recent completed/failed jobs
  const jobs = await queue.fetch(name, limit, { includeMetadata: true });
  return (jobs || []) as JobStatus[];
}

// Schedule hourly news collection
export async function scheduleHourlyNewsCollection(): Promise<void> {
  const queue = await getJobQueue();
  const scheduleName = 'hourly-news-collection';
  
  // Unschedule existing schedule to avoid duplicates
  try {
    await queue.unschedule(scheduleName);
    console.log('[JobQueue] Removed existing schedule');
  } catch (e) {
    // Schedule might not exist, ignore
  }
  
  // Schedule news collection every hour at minute 0
  // Cron: "0 * * * *" = every hour at minute 0
  // pg-boss schedule signature: schedule(name, cron, data?, options?)
  await queue.schedule(
    JobNames.NEWS_COLLECTION, // Job queue name to send to
    '0 * * * *', // Every hour at minute 0
    {
      triggeredBy: 'cron',
      triggeredAt: new Date().toISOString(),
    },
    {
      singletonKey: scheduleName,
      retryLimit: 3,
      retryDelay: 300, // 5 minutes between retries
    }
  );
  
  console.log('[JobQueue] Scheduled hourly news collection (cron: "0 * * * *")');
}

// Get schedule info
export async function getScheduleInfo(): Promise<{
  name: string;
  cron: string;
  nextRun: Date | null;
}[]> {
  const queue = await getJobQueue();
  
  try {
    // Get schedules from pg-boss
    const schedules = await queue.getSchedules();
    return schedules.map((s: any) => ({
      name: s.name,
      cron: s.cron,
      nextRun: s.nextRun || null,
    }));
  } catch (e) {
    console.error('[JobQueue] Failed to get schedules:', e);
    return [];
  }
}

export default {
  getJobQueue,
  startJobQueue,
  stopJobQueue,
  enqueueJob,
  getJobStatus,
  getQueueStats,
  getRecentJobs,
  scheduleHourlyNewsCollection,
  getScheduleInfo,
  JobNames,
};
