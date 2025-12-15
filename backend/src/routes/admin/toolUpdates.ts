import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../../db/index.js';
import { ToolUpdate, ApiResponse, CreateToolUpdateRequest, Tool } from '../../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { validationError, notFoundError } from '../../middleware/errorHandler.js';

const router = Router();

// GET /api/v1/admin/tool-updates
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });

    const countResult = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM tool_updates`);
    const total = parseInt(countResult?.count || '0', 10);

    const updates = await query<ToolUpdate & { tool_name: string }>(
      `SELECT tu.*, t.name as tool_name
       FROM tool_updates tu
       JOIN tools t ON tu.tool_id = t.id
       ORDER BY tu.updated_on DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const response: ApiResponse<(ToolUpdate & { tool_name: string })[]> = {
      data: updates,
      meta: { pagination: getPaginationMeta(total, { page, limit, offset }) },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tool-updates
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tool_id, updated_on, change_summary } = req.body as CreateToolUpdateRequest;

    if (!tool_id || !change_summary) {
      throw validationError('tool_id and change_summary are required');
    }

    // Verify tool exists
    const tool = await queryOne<Tool>(`SELECT * FROM tools WHERE id = $1`, [tool_id]);
    if (!tool) {
      throw notFoundError('Tool');
    }

    const update = await queryOne<ToolUpdate>(
      `INSERT INTO tool_updates (tool_id, updated_on, change_summary)
       VALUES ($1, COALESCE($2::date, CURRENT_DATE), $3)
       RETURNING *`,
      [tool_id, updated_on || null, change_summary]
    );

    const response: ApiResponse<ToolUpdate> = { data: update! };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/admin/tool-updates/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await queryOne<ToolUpdate>(`SELECT * FROM tool_updates WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Tool update');
    }

    await query(`DELETE FROM tool_updates WHERE id = $1`, [id]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
