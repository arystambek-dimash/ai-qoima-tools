import cron from 'node-cron';
import { collectNews } from './newsCollector.js';

let isCollecting = false;
let lastCollectionTime: Date | null = null;
let lastCollectionResult: { collected: number; saved: number } | null = null;

// Run news collection in background (non-blocking)
async function runNewsCollection(): Promise<void> {
  if (isCollecting) {
    console.log('News collection already in progress, skipping...');
    return;
  }

  isCollecting = true;
  console.log(`[${new Date().toISOString()}] Starting scheduled news collection (background)...`);

  // Run in next tick to not block the event loop
  setImmediate(async () => {
    try {
      lastCollectionResult = await collectNews();
      lastCollectionTime = new Date();
      console.log(`[${new Date().toISOString()}] News collection completed:`, lastCollectionResult);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] News collection failed:`, error);
    } finally {
      isCollecting = false;
    }
  });
}

// Get collection status
export function getCollectionStatus() {
  return {
    isCollecting,
    lastCollectionTime: lastCollectionTime?.toISOString() || null,
    lastResult: lastCollectionResult,
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

// Manual trigger (for admin)
export async function triggerNewsCollection(): Promise<{ success: boolean; message: string; result?: any }> {
  if (isCollecting) {
    return {
      success: false,
      message: 'News collection already in progress',
    };
  }

  try {
    await runNewsCollection();
    return {
      success: true,
      message: 'News collection completed',
      result: lastCollectionResult,
    };
  } catch (error) {
    return {
      success: false,
      message: `News collection failed: ${error}`,
    };
  }
}

// Initialize cron jobs
export function initCronJobs(): void {
  console.log('Initializing cron jobs...');

  // Run news collection every hour at minute 0
  // Cron expression: "0 * * * *" = At minute 0 of every hour
  cron.schedule('0 * * * *', async () => {
    await runNewsCollection();
  });

  console.log('Cron jobs initialized:');
  console.log('  - News collection: Every hour at :00');

  // Run initial collection after 30 seconds (to let server start up)
  setTimeout(async () => {
    console.log('Running initial news collection...');
    await runNewsCollection();
  }, 30000);
}

export default { initCronJobs, triggerNewsCollection, getCollectionStatus };
