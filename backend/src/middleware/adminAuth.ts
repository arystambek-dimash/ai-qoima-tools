import { Request, Response, NextFunction } from 'express';
import { unauthorizedError } from './errorHandler.js';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-admin-token';

export function adminAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.headers['x-admin-token'];

  if (!token || token !== ADMIN_TOKEN) {
    next(unauthorizedError('Invalid or missing admin token'));
    return;
  }

  next();
}
