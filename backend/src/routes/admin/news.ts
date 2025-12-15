import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../../db/index.js';
import { News, ApiResponse, CreateNewsRequest, UpdateNewsRequest } from '../../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { validationError, notFoundError, AppError } from '../../middleware/errorHandler.js';
import { triggerNewsCollection, getCollectionStatus } from '../../services/cronJobs.js';
import { generateArticleContent, generateMissingArticles } from '../../services/articleGenerator.js';

// Grok API configuration (xAI)
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_API_KEY = process.env.GROK_API_KEY;

const router = Router();

// GET /api/v1/admin/news
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });

    const countResult = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM news`);
    const total = parseInt(countResult?.count || '0', 10);

    const news = await query<News>(
      `SELECT * FROM news ORDER BY published_on DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const response: ApiResponse<News[]> = {
      data: news,
      meta: { pagination: getPaginationMeta(total, { page, limit, offset }) },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/news/collection-status
// Returns the status of the automated news collection system
router.get('/collection-status', async (_req: Request, res: Response, _next: NextFunction) => {
  const status = getCollectionStatus();
  res.json({
    data: status,
    meta: {
      description: 'Automated news collection runs every hour. Collects from RSS feeds and generates AI tips.',
    },
  });
});

// POST /api/v1/admin/news/collect
// Manually triggers the automated news collection
router.post('/collect', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await triggerNewsCollection();
    res.json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/news/generate-articles
// Generate full article content with AI translations for news without content
router.post('/generate-articles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const generated = await generateMissingArticles(limit);
    res.json({
      data: { generated },
      meta: {
        description: `Generated full articles for ${generated} news items using gpt-4o-mini`,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/news/:id/generate-article
// Generate full article content for a specific news item
router.post('/:id/generate-article', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await queryOne<News>(`SELECT * FROM news WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('News item');
    }

    const result = await generateArticleContent(id);

    if (!result) {
      throw new AppError(500, 'GENERATION_FAILED', 'Failed to generate article content. Check OpenAI API key.');
    }

    // Get the updated news item
    const updatedNews = await queryOne<News>(`SELECT * FROM news WHERE id = $1`, [id]);

    res.json({
      data: updatedNews,
      meta: {
        translations: {
          ru: { title: result.translations.ru.title, hasContent: !!result.translations.ru.content },
          kk: { title: result.translations.kk.title, hasContent: !!result.translations.kk.content },
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/news
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, source_url, published_on } = req.body as CreateNewsRequest;

    if (!title || !description) {
      throw validationError('title and description are required');
    }

    const newsItem = await queryOne<News>(
      `INSERT INTO news (title, description, source_url, published_on)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE))
       RETURNING *`,
      [title, description, source_url || null, published_on || null]
    );

    const response: ApiResponse<News> = { data: newsItem! };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/news/fetch-from-x
// Uses Grok API to search and parse latest AI tool news from X/Twitter
// IMPORTANT: This route must be defined BEFORE /:id routes
router.post('/fetch-from-x', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!GROK_API_KEY) {
      throw new AppError(500, 'GROK_API_KEY_MISSING', 'Grok API key is not configured. Please add GROK_API_KEY to your .env file.');
    }

    // Use Grok to search for HOT/TRENDING AI news only
    const grokResponse = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: `You are an AI news curator. Search X (Twitter) for the HOTTEST and most IMPORTANT AI news only.

STRICT CRITERIA - Only include news that:
1. Has HIGH engagement (many likes, retweets, replies)
2. Is from VERIFIED or reputable sources (official accounts, journalists, industry experts)
3. Is ORIGINAL content (NO watermarked images, NO reposts, NO promotional spam)
4. Is BREAKING or TRENDING in the last 24 hours
5. Is about major AI tools: ChatGPT, Claude, Gemini, Midjourney, Cursor, DALL-E, Copilot, Perplexity

EXCLUDE:
- Promotional/marketing content
- Personal opinions without news value
- Duplicate/reposted content
- News older than 24 hours
- Clickbait or misleading headlines

Return EXACTLY 5 verified, high-quality news items in JSON:
{
  "news": [
    {
      "title": "Concise factual headline (max 80 chars)",
      "description": "What happened and why it matters to AI users (2-3 sentences)",
      "source_url": "https://x.com/username/status/id",
      "importance": "high|medium",
      "category": "Product Launch|Update|Research|Business|Tutorial"
    }
  ]
}

Only return JSON, no other text.`
          },
          {
            role: 'user',
            content: `Find the TOP 5 most important and trending AI tool news from X/Twitter right now. Today is ${new Date().toISOString().split('T')[0]}. Focus on breaking news, major announcements, and viral AI tool updates. Exclude any spam or promotional content.`
          }
        ],
        temperature: 0.5, // Lower temperature for more factual results
      }),
    });

    if (!grokResponse.ok) {
      const errorBody = await grokResponse.text();
      console.error('Grok API error:', errorBody);
      throw new AppError(500, 'GROK_API_ERROR', `Grok API returned ${grokResponse.status}: ${errorBody}`);
    }

    const grokData = await grokResponse.json();
    const content = grokData.choices?.[0]?.message?.content;

    if (!content) {
      throw new AppError(500, 'GROK_EMPTY_RESPONSE', 'Grok API returned empty response');
    }

    // Parse the JSON from Grok response
    let newsItems;
    try {
      // Extract JSON from response (in case there's surrounding text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      newsItems = parsed.news || [];
    } catch (parseError) {
      console.error('Failed to parse Grok response:', content);
      throw new AppError(500, 'GROK_PARSE_ERROR', 'Failed to parse Grok API response');
    }

    // Insert news items into database
    const insertedNews: News[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (const item of newsItems) {
      if (!item.title || !item.description) continue;

      // Check if similar news already exists (by title similarity)
      const existing = await queryOne<{ count: string }>(
        `SELECT COUNT(*) as count FROM news WHERE LOWER(title) = LOWER($1)`,
        [item.title]
      );

      if (parseInt(existing?.count || '0', 10) === 0) {
        const inserted = await queryOne<News>(
          `INSERT INTO news (title, description, source_url, published_on)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [item.title, item.description, item.source_url || null, today]
        );
        if (inserted) {
          insertedNews.push(inserted);
        }
      }
    }

    const response: ApiResponse<News[]> = {
      data: insertedNews,
      meta: {
        fetched: newsItems.length,
        inserted: insertedNews.length,
        skipped: newsItems.length - insertedNews.length,
      } as any
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/news/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const newsItem = await queryOne<News>(`SELECT * FROM news WHERE id = $1`, [id]);

    if (!newsItem) {
      throw notFoundError('News item');
    }

    const response: ApiResponse<News> = { data: newsItem };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/news/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, source_url, published_on } = req.body as UpdateNewsRequest;

    const existing = await queryOne<News>(`SELECT * FROM news WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('News item');
    }

    const newsItem = await queryOne<News>(
      `UPDATE news
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           source_url = COALESCE($3, source_url),
           published_on = COALESCE($4::date, published_on)
       WHERE id = $5
       RETURNING *`,
      [title, description, source_url, published_on, id]
    );

    const response: ApiResponse<News> = { data: newsItem! };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/admin/news/:id (alias for PUT)
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, source_url, published_on } = req.body as UpdateNewsRequest;

    const existing = await queryOne<News>(`SELECT * FROM news WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('News item');
    }

    const newsItem = await queryOne<News>(
      `UPDATE news
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           source_url = COALESCE($3, source_url),
           published_on = COALESCE($4::date, published_on)
       WHERE id = $5
       RETURNING *`,
      [title, description, source_url, published_on, id]
    );

    const response: ApiResponse<News> = { data: newsItem! };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/admin/news/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await queryOne<News>(`SELECT * FROM news WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('News item');
    }

    await query(`DELETE FROM news WHERE id = $1`, [id]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
