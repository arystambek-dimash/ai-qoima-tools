import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../../db/index.js';
import { UseCase, ApiResponse, CreateUseCaseRequest, UpdateUseCaseRequest } from '../../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { validationError, notFoundError } from '../../middleware/errorHandler.js';

const router = Router();

// GET /api/v1/admin/use-cases
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });

    const countResult = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM use_cases`);
    const total = parseInt(countResult?.count || '0', 10);

    const useCases = await query<UseCase>(
      `SELECT * FROM use_cases ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const response: ApiResponse<UseCase[]> = {
      data: useCases,
      meta: { pagination: getPaginationMeta(total, { page, limit, offset }) },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/use-cases
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, title, summary, when_to_use, audience } = req.body as CreateUseCaseRequest;

    if (!slug || !title || !summary) {
      throw validationError('slug, title, and summary are required');
    }

    const useCase = await queryOne<UseCase>(
      `INSERT INTO use_cases (slug, title, summary, when_to_use, audience)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [slug, title, summary, when_to_use || null, audience || null]
    );

    const response: ApiResponse<UseCase> = { data: useCase! };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/use-cases/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const useCase = await queryOne<UseCase>(`SELECT * FROM use_cases WHERE id = $1`, [id]);

    if (!useCase) {
      throw notFoundError('Use case');
    }

    const response: ApiResponse<UseCase> = { data: useCase };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/use-cases/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { slug, title, summary, when_to_use, audience } = req.body as UpdateUseCaseRequest;

    const existing = await queryOne<UseCase>(`SELECT * FROM use_cases WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Use case');
    }

    const useCase = await queryOne<UseCase>(
      `UPDATE use_cases
       SET slug = COALESCE($1, slug),
           title = COALESCE($2, title),
           summary = COALESCE($3, summary),
           when_to_use = COALESCE($4, when_to_use),
           audience = COALESCE($5, audience)
       WHERE id = $6
       RETURNING *`,
      [slug, title, summary, when_to_use, audience, id]
    );

    const response: ApiResponse<UseCase> = { data: useCase! };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/admin/use-cases/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await queryOne<UseCase>(`SELECT * FROM use_cases WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Use case');
    }

    await query(`DELETE FROM use_cases WHERE id = $1`, [id]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
