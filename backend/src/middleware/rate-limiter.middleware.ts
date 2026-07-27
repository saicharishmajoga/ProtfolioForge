import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/response-formatter';

export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'Too many requests, please try again later.', [], 429);
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login/register attempts per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'Too many authentication attempts, please try again after 15 minutes.', [], 429);
  },
});
