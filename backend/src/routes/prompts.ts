import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../db/index.js';
import { Prompt, ApiResponse } from '../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { notFoundError } from '../middleware/errorHandler.js';
import {
  getTranslations,
  getBatchTranslations,
  applyTranslations,
  applyBatchTranslations,
} from '../utils/translations.js';

const router = Router();

// GET /api/v1/prompts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const useCaseId = req.query.use_case_id as string | undefined;
    const toolId = req.query.tool_id as string | undefined;
    const locale = (req.query.locale as string) || 'en';

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(title ILIKE $${params.length} OR prompt_text ILIKE $${params.length})`);
    }

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (useCaseId) {
      params.push(useCaseId);
      conditions.push(`use_case_id = $${params.length}`);
    }

    if (toolId) {
      params.push(toolId);
      conditions.push(`tool_id = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM prompts ${whereClause}`,
      params
    );
    const total = parseInt(countResult?.count || '0', 10);

    const prompts = await query<Prompt>(
      `SELECT * FROM prompts ${whereClause} ORDER BY title ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    // Apply translations if not English
    let translatedPrompts = prompts;
    if (locale !== 'en' && prompts.length > 0) {
      const translationsMap = await getBatchTranslations(
        'prompt',
        prompts.map((p) => p.id),
        locale
      );
      translatedPrompts = applyBatchTranslations(prompts, translationsMap);
    }

    const response: ApiResponse<Prompt[]> = {
      data: translatedPrompts,
      meta: {
        pagination: getPaginationMeta(total, { page, limit, offset }),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/prompts/categories
router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query<{ category: string }>(
      `SELECT DISTINCT category FROM prompts WHERE category IS NOT NULL ORDER BY category`
    );

    const categories = result.map((r) => r.category);

    const response: ApiResponse<string[]> = { data: categories };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/prompts/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const locale = (req.query.locale as string) || 'en';

    const prompt = await queryOne<Prompt>(
      `SELECT * FROM prompts WHERE id = $1`,
      [id]
    );

    if (!prompt) {
      throw notFoundError('Prompt');
    }

    // Apply translations if not English
    let translatedPrompt = prompt;
    if (locale !== 'en') {
      const translations = await getTranslations('prompt', id, locale);
      translatedPrompt = applyTranslations(prompt, translations);
    }

    const response: ApiResponse<Prompt> = { data: translatedPrompt };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/prompts/slug/:slug
router.get('/slug/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const locale = (req.query.locale as string) || 'en';

    const prompt = await queryOne<Prompt>(
      `SELECT * FROM prompts WHERE slug = $1`,
      [slug]
    );

    if (!prompt) {
      throw notFoundError('Prompt');
    }

    // Apply translations if not English
    let translatedPrompt = prompt;
    if (locale !== 'en') {
      const translations = await getTranslations('prompt', prompt.id, locale);
      translatedPrompt = applyTranslations(prompt, translations);
    }

    const response: ApiResponse<Prompt> = { data: translatedPrompt };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
