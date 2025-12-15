import { Router, Request, Response, NextFunction } from 'express';
import { query, queryOne } from '../db/index.js';
import { Subscriber, ApiResponse } from '../types/index.js';
import { validationError, notFoundError, conflictError } from '../middleware/errorHandler.js';

const router = Router();

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/v1/subscribers
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      throw validationError('Email is required');
    }

    if (!emailRegex.test(email)) {
      throw validationError('Invalid email format');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await queryOne<Subscriber>(
      `SELECT * FROM subscribers WHERE email = $1`,
      [normalizedEmail]
    );

    if (existing) {
      if (existing.status === 'active') {
        throw conflictError('Email is already subscribed');
      }

      // Reactivate unsubscribed email
      const reactivated = await queryOne<Subscriber>(
        `UPDATE subscribers
         SET status = 'active', unsubscribed_at = NULL, unsubscribe_token = uuid_generate_v4()
         WHERE email = $1
         RETURNING *`,
        [normalizedEmail]
      );

      const response: ApiResponse<{ message: string; subscriber: Subscriber }> = {
        data: {
          message: 'Successfully resubscribed',
          subscriber: reactivated!,
        },
      };
      res.status(200).json(response);
      return;
    }

    // Create new subscriber
    const subscriber = await queryOne<Subscriber>(
      `INSERT INTO subscribers (email) VALUES ($1) RETURNING *`,
      [normalizedEmail]
    );

    const response: ApiResponse<{ message: string; subscriber: Subscriber }> = {
      data: {
        message: 'Successfully subscribed',
        subscriber: subscriber!,
      },
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/subscribers/:unsubscribe_token
router.delete('/:unsubscribe_token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { unsubscribe_token } = req.params;

    const subscriber = await queryOne<Subscriber>(
      `SELECT * FROM subscribers WHERE unsubscribe_token = $1`,
      [unsubscribe_token]
    );

    if (!subscriber) {
      throw notFoundError('Subscriber');
    }

    if (subscriber.status === 'unsubscribed') {
      const response: ApiResponse<{ message: string }> = {
        data: { message: 'Already unsubscribed' },
      };
      res.json(response);
      return;
    }

    await query(
      `UPDATE subscribers
       SET status = 'unsubscribed', unsubscribed_at = NOW()
       WHERE unsubscribe_token = $1`,
      [unsubscribe_token]
    );

    const response: ApiResponse<{ message: string }> = {
      data: { message: 'Successfully unsubscribed' },
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
