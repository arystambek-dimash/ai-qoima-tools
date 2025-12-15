import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../../db/index.js';
import { Subscriber, ApiResponse } from '../../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';

const router = Router();

// GET /api/v1/admin/subscribers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });
    const status = req.query.status as string | undefined;

    let whereClause = '';
    const params: unknown[] = [];

    if (status && ['active', 'unsubscribed'].includes(status)) {
      params.push(status);
      whereClause = `WHERE status = $1`;
    }

    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM subscribers ${whereClause}`,
      params
    );
    const total = parseInt(countResult?.count || '0', 10);

    const subscribers = await query<Subscriber>(
      `SELECT id, email, status, created_at, unsubscribed_at
       FROM subscribers ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const response: ApiResponse<Subscriber[]> = {
      data: subscribers,
      meta: {
        pagination: getPaginationMeta(total, { page, limit, offset }),
        activeCount: await getStatusCount('active'),
        unsubscribedCount: await getStatusCount('unsubscribed'),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

async function getStatusCount(status: string): Promise<number> {
  const result = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM subscribers WHERE status = $1`,
    [status]
  );
  return parseInt(result?.count || '0', 10);
}

export default router;
