import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db/index.js';
import { z } from 'zod';

const router = Router();

// Validation schema for email
const validateEmailSchema = z.object({
    email: z.string().email(),
});

// POST /auth/validate-email - Check if email domain is allowed
router.post('/validate-email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = validateEmailSchema.parse(req.body);
        
        // Extract domain from email
        const domain = email.split('@')[1]?.toLowerCase();
        
        if (!domain) {
            return res.status(400).json({
                allowed: false,
                error: { code: 'INVALID_EMAIL', message: 'Invalid email format' }
            });
        }

        // Check if domain is in allowed companies
        const companyResult = await pool.query(`
            SELECT id, name, email_domain, max_users
            FROM companies
            WHERE email_domain = $1 AND is_active = true
        `, [domain]);

        if (companyResult.rows.length === 0) {
            return res.json({
                allowed: false,
                message: 'Your email domain is not authorized to access this platform',
            });
        }

        const company = companyResult.rows[0];

        // Check if max_users limit is reached
        if (company.max_users) {
            const userCountResult = await pool.query(
                'SELECT COUNT(*) as count FROM users WHERE company_id = $1',
                [company.id]
            );
            const currentUserCount = parseInt(userCountResult.rows[0].count);

            // Check if this user already exists
            const existingUser = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [email.toLowerCase()]
            );

            // If user doesn't exist and we're at the limit, deny
            if (existingUser.rows.length === 0 && currentUserCount >= company.max_users) {
                return res.json({
                    allowed: false,
                    message: 'Maximum number of users for your organization has been reached',
                });
            }
        }

        res.json({
            allowed: true,
            company: {
                id: company.id,
                name: company.name,
            },
        });
    } catch (error) {
        next(error);
    }
});

// POST /auth/login - Login/register user with email
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = validateEmailSchema.parse(req.body);
        const normalizedEmail = email.toLowerCase();
        
        // Extract domain from email
        const domain = normalizedEmail.split('@')[1];
        
        if (!domain) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_EMAIL', message: 'Invalid email format' }
            });
        }

        // Check if domain is in allowed companies
        const companyResult = await pool.query(`
            SELECT id, name, email_domain, max_users
            FROM companies
            WHERE email_domain = $1 AND is_active = true
        `, [domain]);

        if (companyResult.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: { code: 'UNAUTHORIZED_DOMAIN', message: 'Your email domain is not authorized' }
            });
        }

        const company = companyResult.rows[0];

        // Check if user already exists
        let userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [normalizedEmail]
        );

        if (userResult.rows.length === 0) {
            // Check max_users limit before creating new user
            if (company.max_users) {
                const countResult = await pool.query(
                    'SELECT COUNT(*) as count FROM users WHERE company_id = $1',
                    [company.id]
                );
                if (parseInt(countResult.rows[0].count) >= company.max_users) {
                    return res.status(403).json({
                        success: false,
                        error: { code: 'MAX_USERS_REACHED', message: 'Maximum users reached for your organization' }
                    });
                }
            }

            // Create new user
            userResult = await pool.query(`
                INSERT INTO users (email, company_id, last_login_at)
                VALUES ($1, $2, NOW())
                RETURNING *
            `, [normalizedEmail, company.id]);
        } else {
            // Update last login
            userResult = await pool.query(`
                UPDATE users
                SET last_login_at = NOW()
                WHERE email = $1
                RETURNING *
            `, [normalizedEmail]);
        }

        const user = userResult.rows[0];

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                error: { code: 'USER_INACTIVE', message: 'Your account has been deactivated' }
            });
        }

        // Generate a simple session token (in production, use JWT or proper session management)
        const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: {
                    id: company.id,
                    name: company.name,
                },
            },
            token: sessionToken,
        });
    } catch (error) {
        next(error);
    }
});

// GET /auth/me - Get current user info (validate session)
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: { code: 'UNAUTHORIZED', message: 'No authorization token provided' }
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // Decode token
        let userId: string;
        try {
            const decoded = Buffer.from(token, 'base64').toString();
            userId = decoded.split(':')[0];
        } catch {
            return res.status(401).json({
                error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
            });
        }

        // Get user with company info
        const result = await pool.query(`
            SELECT u.*, c.name as company_name
            FROM users u
            LEFT JOIN companies c ON c.id = u.company_id
            WHERE u.id = $1 AND u.is_active = true
        `, [userId]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: { code: 'USER_NOT_FOUND', message: 'User not found or inactive' }
            });
        }

        const user = result.rows[0];

        // Also check if company is still active
        if (user.company_id) {
            const companyResult = await pool.query(
                'SELECT is_active FROM companies WHERE id = $1',
                [user.company_id]
            );
            if (companyResult.rows.length > 0 && !companyResult.rows[0].is_active) {
                return res.status(403).json({
                    error: { code: 'COMPANY_INACTIVE', message: 'Your organization access has been revoked' }
                });
            }
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company_id ? {
                    id: user.company_id,
                    name: user.company_name,
                } : null,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
