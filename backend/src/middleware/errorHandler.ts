import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/index.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: ApiError['error']['code'],
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundError(resource: string): AppError {
  return new AppError(404, 'NOT_FOUND', `${resource} not found`);
}

export function validationError(message: string, details?: Record<string, unknown>): AppError {
  return new AppError(400, 'VALIDATION_ERROR', message, details);
}

export function unauthorizedError(message = 'Unauthorized'): AppError {
  return new AppError(401, 'UNAUTHORIZED', message);
}

export function conflictError(message: string): AppError {
  return new AppError(409, 'CONFLICT', message);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const response: ApiError = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle PostgreSQL errors
  if ((err as { code?: string }).code === '23505') {
    const response: ApiError = {
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists',
      },
    };
    res.status(409).json(response);
    return;
  }

  // Default error
  const response: ApiError = {
    error: {
      code: 'INTERNAL',
      message: 'Internal server error',
    },
  };
  res.status(500).json(response);
}
