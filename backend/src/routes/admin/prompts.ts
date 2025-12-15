import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../../db/index.js';
import { Prompt, ApiResponse, CreatePromptRequest, UpdatePromptRequest } from '../../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { validationError, notFoundError } from '../../middleware/errorHandler.js';

const router = Router();

// GET /api/v1/admin/prompts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });

    const countResult = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM prompts`);
    const total = parseInt(countResult?.count || '0', 10);

    const prompts = await query<Prompt>(
      `SELECT * FROM prompts ORDER BY title ASC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const response: ApiResponse<Prompt[]> = {
      data: prompts,
      meta: { pagination: getPaginationMeta(total, { page, limit, offset }) },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/prompts
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug, title, category, use_case_id, prompt_text } = req.body as CreatePromptRequest;

    if (!slug || !title || !prompt_text) {
      throw validationError('slug, title, and prompt_text are required');
    }

    const prompt = await queryOne<Prompt>(
      `INSERT INTO prompts (slug, title, category, use_case_id, prompt_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [slug, title, category || null, use_case_id || null, prompt_text]
    );

    const response: ApiResponse<Prompt> = { data: prompt! };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/prompts/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const prompt = await queryOne<Prompt>(`SELECT * FROM prompts WHERE id = $1`, [id]);

    if (!prompt) {
      throw notFoundError('Prompt');
    }

    const response: ApiResponse<Prompt> = { data: prompt };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/prompts/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { slug, title, category, use_case_id, prompt_text } = req.body as UpdatePromptRequest;

    const existing = await queryOne<Prompt>(`SELECT * FROM prompts WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Prompt');
    }

    const prompt = await queryOne<Prompt>(
      `UPDATE prompts
       SET slug = COALESCE($1, slug),
           title = COALESCE($2, title),
           category = COALESCE($3, category),
           use_case_id = COALESCE($4, use_case_id),
           prompt_text = COALESCE($5, prompt_text)
       WHERE id = $6
       RETURNING *`,
      [slug, title, category, use_case_id, prompt_text, id]
    );

    const response: ApiResponse<Prompt> = { data: prompt! };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/admin/prompts/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await queryOne<Prompt>(`SELECT * FROM prompts WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Prompt');
    }

    await query(`DELETE FROM prompts WHERE id = $1`, [id]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
