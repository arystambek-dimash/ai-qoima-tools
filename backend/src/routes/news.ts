import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../db/index.js';
import { News, ApiResponse } from '../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { notFoundError } from '../middleware/errorHandler.js';
import {
  getTranslations,
  getBatchTranslations,
  applyTranslations,
  applyBatchTranslations,
} from '../utils/translations.js';

const router = Router();

// GET /api/v1/news
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });
    const locale = (req.query.locale as string) || 'en';

    const countResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM news`
    );
    const total = parseInt(countResult?.count || '0', 10);

    const news = await query<News>(
      `SELECT * FROM news ORDER BY published_on DESC, created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Apply translations if not English
    let translatedNews = news;
    if (locale !== 'en' && news.length > 0) {
      const translationsMap = await getBatchTranslations(
        'news',
        news.map((n) => n.id),
        locale
      );
      translatedNews = applyBatchTranslations(news, translationsMap);
    }

    const response: ApiResponse<News[]> = {
      data: translatedNews,
      meta: {
        pagination: getPaginationMeta(total, { page, limit, offset }),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/news/:idOrSlug
router.get('/:idOrSlug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idOrSlug } = req.params;
    const locale = (req.query.locale as string) || 'en';

    // Try to find by ID first (UUID format), then by slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let newsItem: News | null;

    if (isUUID) {
      newsItem = await queryOne<News>(`SELECT * FROM news WHERE id = $1`, [idOrSlug]);
    } else {
      newsItem = await queryOne<News>(`SELECT * FROM news WHERE slug = $1`, [idOrSlug]);
    }

    if (!newsItem) {
      throw notFoundError('News article');
    }

    // Get related news (same category or recent)
    let relatedNews: News[];

    if (newsItem.category) {
      // First try to get news from same category
      relatedNews = await query<News>(
        `SELECT * FROM news
         WHERE id != $1 AND category = $2
         ORDER BY published_on DESC
         LIMIT 3`,
        [newsItem.id, newsItem.category]
      );
    } else {
      relatedNews = [];
    }

    // If not enough related news, fill with recent news
    if (relatedNews.length < 3) {
      const existingIds = [newsItem.id, ...relatedNews.map(n => n.id)];
      const moreNews = await query<News>(
        `SELECT * FROM news
         WHERE id != ALL($1::uuid[])
         ORDER BY published_on DESC
         LIMIT $2`,
        [existingIds, 3 - relatedNews.length]
      );
      relatedNews = [...relatedNews, ...moreNews];
    }

    // Apply translations if not English
    let translatedNewsItem = newsItem;
    let translatedRelatedNews = relatedNews;

    if (locale !== 'en') {
      const mainTranslations = await getTranslations('news', newsItem.id, locale);
      translatedNewsItem = applyTranslations(newsItem, mainTranslations);

      if (relatedNews.length > 0) {
        const relatedTranslationsMap = await getBatchTranslations(
          'news',
          relatedNews.map((n) => n.id),
          locale
        );
        translatedRelatedNews = applyBatchTranslations(relatedNews, relatedTranslationsMap);
      }
    }

    const response: ApiResponse<News & { related: News[] }> = {
      data: { ...translatedNewsItem, related: translatedRelatedNews },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
