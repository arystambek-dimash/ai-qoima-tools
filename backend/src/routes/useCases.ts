import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../db/index.js';
import { UseCase, Tool, ApiResponse, UseCaseWithTools } from '../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { notFoundError } from '../middleware/errorHandler.js';
import {
  getTranslations,
  getBatchTranslations,
  applyTranslations,
  applyBatchTranslations,
} from '../utils/translations.js';

const router = Router();

// GET /api/v1/use-cases
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });
    const search = req.query.search as string | undefined;
    const locale = (req.query.locale as string) || 'en';

    let whereClause = '';
    const params: unknown[] = [];

    if (search) {
      whereClause = `WHERE title ILIKE $1 OR summary ILIKE $1`;
      params.push(`%${search}%`);
    }

    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM use_cases ${whereClause}`,
      params
    );
    const total = parseInt(countResult?.count || '0', 10);

    const useCases = await query<UseCase>(
      `SELECT * FROM use_cases ${whereClause} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    // Apply translations if not English
    let translatedUseCases = useCases;
    if (locale !== 'en' && useCases.length > 0) {
      const translationsMap = await getBatchTranslations(
        'use_case',
        useCases.map((uc) => uc.id),
        locale
      );
      translatedUseCases = applyBatchTranslations(useCases, translationsMap);
    }

    const response: ApiResponse<UseCase[]> = {
      data: translatedUseCases,
      meta: {
        pagination: getPaginationMeta(total, { page, limit, offset }),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/use-cases/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const locale = (req.query.locale as string) || 'en';

    const useCase = await queryOne<UseCase>(
      `SELECT * FROM use_cases WHERE id = $1`,
      [id]
    );

    if (!useCase) {
      throw notFoundError('Use case');
    }

    // Apply translations if not English
    let translatedUseCase = useCase;
    if (locale !== 'en') {
      const translations = await getTranslations('use_case', id, locale);
      translatedUseCase = applyTranslations(useCase, translations);
    }

    const response: ApiResponse<UseCase> = { data: translatedUseCase };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/use-cases/slug/:slug
router.get('/slug/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const locale = (req.query.locale as string) || 'en';

    const useCase = await queryOne<UseCase>(
      `SELECT * FROM use_cases WHERE slug = $1`,
      [slug]
    );

    if (!useCase) {
      throw notFoundError('Use case');
    }

    // Apply translations if not English
    let translatedUseCase = useCase;
    if (locale !== 'en') {
      const translations = await getTranslations('use_case', useCase.id, locale);
      translatedUseCase = applyTranslations(useCase, translations);
    }

    const response: ApiResponse<UseCase> = { data: translatedUseCase };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/use-cases/:id/tools
router.get('/:id/tools', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const locale = (req.query.locale as string) || 'en';

    // First check if use case exists
    const useCase = await queryOne<UseCase>(
      `SELECT * FROM use_cases WHERE id = $1`,
      [id]
    );

    if (!useCase) {
      throw notFoundError('Use case');
    }

    // Get tools with junction table info
    const tools = await query<Tool & { rank: number; why_this_tool: string | null }>(
      `SELECT t.*, uct.rank, uct.why_this_tool
       FROM tools t
       JOIN use_case_tools uct ON t.id = uct.tool_id
       WHERE uct.use_case_id = $1
       ORDER BY uct.rank ASC`,
      [id]
    );

    // Apply translations if not English
    let translatedUseCase = useCase;
    let translatedTools = tools;

    if (locale !== 'en') {
      const useCaseTranslations = await getTranslations('use_case', id, locale);
      translatedUseCase = applyTranslations(useCase, useCaseTranslations);

      if (tools.length > 0) {
        const toolsTranslationsMap = await getBatchTranslations(
          'tool',
          tools.map((t) => t.id),
          locale
        );
        translatedTools = applyBatchTranslations(tools, toolsTranslationsMap);
      }
    }

    const useCaseWithTools: UseCaseWithTools = {
      ...translatedUseCase,
      tools: translatedTools,
    };

    const response: ApiResponse<UseCaseWithTools> = { data: useCaseWithTools };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
