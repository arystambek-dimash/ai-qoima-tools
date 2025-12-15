import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../db/index.js';
import { Tool, ToolUpdate, ApiResponse } from '../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { notFoundError } from '../middleware/errorHandler.js';
import {
  getTranslations,
  getBatchTranslations,
  applyTranslations,
  applyBatchTranslations,
} from '../utils/translations.js';

const router = Router();

// GET /api/v1/tools
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const locale = (req.query.locale as string) || 'en';

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR short_description ILIKE $${params.length})`);
    }

    if (category) {
      params.push(category);
      conditions.push(`$${params.length} = ANY(categories)`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM tools ${whereClause}`,
      params
    );
    const total = parseInt(countResult?.count || '0', 10);

    const tools = await query<Tool>(
      `SELECT * FROM tools ${whereClause} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    // Apply translations if not English
    let translatedTools = tools;
    if (locale !== 'en' && tools.length > 0) {
      const translationsMap = await getBatchTranslations(
        'tool',
        tools.map((t) => t.id),
        locale
      );
      translatedTools = applyBatchTranslations(tools, translationsMap);
    }

    const response: ApiResponse<Tool[]> = {
      data: translatedTools,
      meta: {
        pagination: getPaginationMeta(total, { page, limit, offset }),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tools/categories
router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query<{ category: string }>(
      `SELECT DISTINCT unnest(categories) as category FROM tools ORDER BY category`
    );

    const categories = result.map((r) => r.category);

    const response: ApiResponse<string[]> = { data: categories };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tools/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const locale = (req.query.locale as string) || 'en';

    const tool = await queryOne<Tool>(
      `SELECT * FROM tools WHERE id = $1`,
      [id]
    );

    if (!tool) {
      throw notFoundError('Tool');
    }

    // Apply translations if not English
    let translatedTool = tool;
    if (locale !== 'en') {
      const translations = await getTranslations('tool', id, locale);
      translatedTool = applyTranslations(tool, translations);
    }

    const response: ApiResponse<Tool> = { data: translatedTool };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tools/slug/:slug
router.get('/slug/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const locale = (req.query.locale as string) || 'en';

    const tool = await queryOne<Tool>(
      `SELECT * FROM tools WHERE slug = $1`,
      [slug]
    );

    if (!tool) {
      throw notFoundError('Tool');
    }

    // Apply translations if not English
    let translatedTool = tool;
    if (locale !== 'en') {
      const translations = await getTranslations('tool', tool.id, locale);
      translatedTool = applyTranslations(tool, translations);
    }

    const response: ApiResponse<Tool> = { data: translatedTool };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tools/:id/updates
router.get('/:id/updates', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if tool exists
    const tool = await queryOne<Tool>(
      `SELECT * FROM tools WHERE id = $1`,
      [id]
    );

    if (!tool) {
      throw notFoundError('Tool');
    }

    const updates = await query<ToolUpdate>(
      `SELECT * FROM tool_updates WHERE tool_id = $1 ORDER BY updated_on DESC`,
      [id]
    );

    const response: ApiResponse<ToolUpdate[]> = { data: updates };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
