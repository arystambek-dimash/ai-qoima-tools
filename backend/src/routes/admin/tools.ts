import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../../db/index.js';
import { Tool, ApiResponse, CreateToolRequest, UpdateToolRequest } from '../../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { validationError, notFoundError } from '../../middleware/errorHandler.js';

const router = Router();

// GET /api/v1/admin/tools
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });

    const countResult = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM tools`);
    const total = parseInt(countResult?.count || '0', 10);

    const tools = await query<Tool>(
      `SELECT * FROM tools ORDER BY name ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const response: ApiResponse<Tool[]> = {
      data: tools,
      meta: { pagination: getPaginationMeta(total, { page, limit, offset }) },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tools
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      slug,
      name,
      short_description,
      long_description,
      categories,
      limitations,
      external_url,
      badges,
    } = req.body as CreateToolRequest;

    if (!slug || !name || !short_description) {
      throw validationError('slug, name, and short_description are required');
    }

    const tool = await queryOne<Tool>(
      `INSERT INTO tools (slug, name, short_description, long_description, categories, limitations, external_url, badges)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        slug,
        name,
        short_description,
        long_description || null,
        categories || [],
        limitations || null,
        external_url || null,
        badges || {},
      ]
    );

    const response: ApiResponse<Tool> = { data: tool! };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/tools/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const tool = await queryOne<Tool>(`SELECT * FROM tools WHERE id = $1`, [id]);

    if (!tool) {
      throw notFoundError('Tool');
    }

    const response: ApiResponse<Tool> = { data: tool };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/tools/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      slug,
      name,
      short_description,
      long_description,
      categories,
      limitations,
      external_url,
      badges,
    } = req.body as UpdateToolRequest;

    const existing = await queryOne<Tool>(`SELECT * FROM tools WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Tool');
    }

    const tool = await queryOne<Tool>(
      `UPDATE tools
       SET slug = COALESCE($1, slug),
           name = COALESCE($2, name),
           short_description = COALESCE($3, short_description),
           long_description = COALESCE($4, long_description),
           categories = COALESCE($5, categories),
           limitations = COALESCE($6, limitations),
           external_url = COALESCE($7, external_url),
           badges = COALESCE($8, badges)
       WHERE id = $9
       RETURNING *`,
      [slug, name, short_description, long_description, categories, limitations, external_url, badges, id]
    );

    const response: ApiResponse<Tool> = { data: tool! };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/admin/tools/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await queryOne<Tool>(`SELECT * FROM tools WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Tool');
    }

    await query(`DELETE FROM tools WHERE id = $1`, [id]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
