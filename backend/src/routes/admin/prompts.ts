import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../../db/index.js';
import { Prompt, ApiResponse, CreatePromptRequest, UpdatePromptRequest } from '../../types/index.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';
import { validationError, notFoundError } from '../../middleware/errorHandler.js';

const router = Router();

// Extended interfaces for prompt with tools
interface PromptWithTools extends Prompt {
  tool_ids: string[];
}

interface CreatePromptWithToolsRequest extends CreatePromptRequest {
  tool_ids?: string[];
}

interface UpdatePromptWithToolsRequest extends UpdatePromptRequest {
  tool_ids?: string[];
}

// GET /api/v1/admin/prompts
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query as { page?: string; limit?: string });

    const countResult = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM prompts`);
    const total = parseInt(countResult?.count || '0', 10);

    const prompts = await query<PromptWithTools>(
      `SELECT 
        p.*,
        COALESCE(
          (SELECT array_agg(pt.tool_id) FROM prompt_tools pt WHERE pt.prompt_id = p.id),
          '{}'::uuid[]
        ) as tool_ids
       FROM prompts p
       ORDER BY p.title ASC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const response: ApiResponse<PromptWithTools[]> = {
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
    const { slug, title, category, use_case_id, prompt_text, tool_ids } = req.body as CreatePromptWithToolsRequest;

    if (!slug || !title || !prompt_text) {
      throw validationError('slug, title, and prompt_text are required');
    }

    // Create the prompt
    const prompt = await queryOne<Prompt>(
      `INSERT INTO prompts (slug, title, category, use_case_id, prompt_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [slug, title, category || null, use_case_id || null, prompt_text]
    );

    if (!prompt) {
      throw new Error('Failed to create prompt');
    }

    // Insert tool associations if provided
    if (tool_ids && tool_ids.length > 0) {
      const toolValues = tool_ids.map((toolId, idx) => 
        `($1, $${idx + 2})`
      ).join(', ');
      
      await query(
        `INSERT INTO prompt_tools (prompt_id, tool_id) VALUES ${toolValues}`,
        [prompt.id, ...tool_ids]
      );
    }

    // Fetch the complete prompt with tools
    const promptWithTools = await queryOne<PromptWithTools>(
      `SELECT 
        p.*,
        COALESCE(
          (SELECT array_agg(pt.tool_id) FROM prompt_tools pt WHERE pt.prompt_id = p.id),
          '{}'::uuid[]
        ) as tool_ids
       FROM prompts p 
       WHERE p.id = $1`,
      [prompt.id]
    );

    const response: ApiResponse<PromptWithTools> = { data: promptWithTools! };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/prompts/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const prompt = await queryOne<PromptWithTools>(
      `SELECT 
        p.*,
        COALESCE(
          (SELECT array_agg(pt.tool_id) FROM prompt_tools pt WHERE pt.prompt_id = p.id),
          '{}'::uuid[]
        ) as tool_ids
       FROM prompts p 
       WHERE p.id = $1`,
      [id]
    );

    if (!prompt) {
      throw notFoundError('Prompt');
    }

    const response: ApiResponse<PromptWithTools> = { data: prompt };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/prompts/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { slug, title, category, use_case_id, prompt_text, tool_ids } = req.body as UpdatePromptWithToolsRequest;

    const existing = await queryOne<Prompt>(`SELECT * FROM prompts WHERE id = $1`, [id]);
    if (!existing) {
      throw notFoundError('Prompt');
    }

    // Update the prompt
    await queryOne<Prompt>(
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

    // Update tool associations if provided
    if (tool_ids !== undefined) {
      // Remove existing associations
      await query(`DELETE FROM prompt_tools WHERE prompt_id = $1`, [id]);
      
      // Insert new associations
      if (tool_ids.length > 0) {
        const toolValues = tool_ids.map((toolId, idx) => 
          `($1, $${idx + 2})`
        ).join(', ');
        
        await query(
          `INSERT INTO prompt_tools (prompt_id, tool_id) VALUES ${toolValues}`,
          [id, ...tool_ids]
        );
      }
    }

    // Fetch the complete prompt with tools
    const promptWithTools = await queryOne<PromptWithTools>(
      `SELECT 
        p.*,
        COALESCE(
          (SELECT array_agg(pt.tool_id) FROM prompt_tools pt WHERE pt.prompt_id = p.id),
          '{}'::uuid[]
        ) as tool_ids
       FROM prompts p 
       WHERE p.id = $1`,
      [id]
    );

    const response: ApiResponse<PromptWithTools> = { data: promptWithTools! };
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

    // Tool associations will be deleted via CASCADE
    await query(`DELETE FROM prompts WHERE id = $1`, [id]);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
