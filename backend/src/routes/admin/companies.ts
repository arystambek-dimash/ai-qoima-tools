import { Router, Request, Response, NextFunction } from 'express';
import pool from '../../db/index.js';
import { z } from 'zod';
import { notFoundError } from '../../middleware/errorHandler.js';

const router = Router();

// Validation schemas
const createCompanySchema = z.object({
    name: z.string().min(1).max(255),
    email_domain: z.string().min(1).max(255).regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/, 'Invalid domain format'),
    description: z.string().optional(),
    is_active: z.boolean().optional().default(true),
    max_users: z.number().int().positive().optional(),
});

const updateCompanySchema = z.object({
    name: z.string().min(1).max(255).optional(),
    email_domain: z.string().min(1).max(255).regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/, 'Invalid domain format').optional(),
    description: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
    max_users: z.number().int().positive().optional().nullable(),
});

// GET /admin/companies - List all companies
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await pool.query(`
            SELECT c.*, 
                   COUNT(u.id) as user_count
            FROM companies c
            LEFT JOIN users u ON u.company_id = c.id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);

        res.json({
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
});

// GET /admin/companies/:id - Get single company
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT c.*, 
                   COUNT(u.id) as user_count
            FROM companies c
            LEFT JOIN users u ON u.company_id = c.id
            WHERE c.id = $1
            GROUP BY c.id
        `, [id]);

        if (result.rows.length === 0) {
            return next(notFoundError('Company not found'));
        }

        // Also get users from this company
        const usersResult = await pool.query(`
            SELECT id, email, name, last_login_at, is_active, created_at
            FROM users
            WHERE company_id = $1
            ORDER BY created_at DESC
        `, [id]);

        res.json({
            data: {
                ...result.rows[0],
                users: usersResult.rows,
            },
        });
    } catch (error) {
        next(error);
    }
});

// POST /admin/companies - Create company
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = createCompanySchema.parse(req.body);

        const result = await pool.query(`
            INSERT INTO companies (name, email_domain, description, is_active, max_users)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [data.name, data.email_domain.toLowerCase(), data.description || null, data.is_active, data.max_users || null]);

        res.status(201).json({
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /admin/companies/:id - Update company
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = updateCompanySchema.parse(req.body);

        // Build dynamic update query
        const updates: string[] = [];
        const values: (string | boolean | number | null)[] = [];
        let paramCount = 1;

        if (data.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(data.name);
        }
        if (data.email_domain !== undefined) {
            updates.push(`email_domain = $${paramCount++}`);
            values.push(data.email_domain.toLowerCase());
        }
        if (data.description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(data.description);
        }
        if (data.is_active !== undefined) {
            updates.push(`is_active = $${paramCount++}`);
            values.push(data.is_active);
        }
        if (data.max_users !== undefined) {
            updates.push(`max_users = $${paramCount++}`);
            values.push(data.max_users);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                error: { code: 'VALIDATION_ERROR', message: 'No fields to update' }
            });
        }

        values.push(id);

        const result = await pool.query(`
            UPDATE companies
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `, values);

        if (result.rows.length === 0) {
            return next(notFoundError('Company not found'));
        }

        res.json({
            data: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /admin/companies/:id - Delete company
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM companies WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return next(notFoundError('Company not found'));
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// GET /admin/companies/:id/users - Get users from a company
router.get('/:id/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT id, email, name, last_login_at, is_active, created_at, updated_at
            FROM users
            WHERE company_id = $1
            ORDER BY created_at DESC
        `, [id]);

        res.json({
            data: result.rows,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
