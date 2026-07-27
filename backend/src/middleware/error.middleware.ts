import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../config/logger';
import { sendError } from '../utils/response-formatter';
import { AppError } from '../utils/custom-errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];

  // Log error
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack, path: req.path });

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [];
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.errors.map((zodErr) => ({
      field: zodErr.path.join('.'),
      message: zodErr.message,
    }));
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma database errors
    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const fields = (err.meta?.target as string[]) || [];
        message = `Unique constraint failed on field(s): ${fields.join(', ')}`;
        break;
      }
      case 'P2025':
        statusCode = 404;
        message = 'Record not found in the database.';
        break;
      default:
        statusCode = 400;
        message = `Database error: ${err.message}`;
    }
  } else {
    // In production, mask raw server error details
    if (process.env.NODE_ENV === 'production') {
      message = 'An unexpected error occurred on the server.';
    } else {
      message = err.message;
    }
  }

  sendError(res, message, errors, statusCode);
};
