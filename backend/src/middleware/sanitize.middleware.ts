import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

const clean = (data: any): any => {
  if (typeof data === 'string') {
    // Escape or clean string data using xss library
    return xss(data);
  }
  if (Array.isArray(data)) {
    return data.map(clean);
  }
  if (typeof data === 'object' && data !== null) {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      cleaned[key] = clean(data[key]);
    }
    return cleaned;
  }
  return data;
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Skip XSS sanitization for the sync endpoint to prevent corrupting rich JSON drafts and base64 image strings
  if (req.path === '/api/auth/sync' || req.originalUrl.includes('/api/auth/sync')) {
    return next();
  }

  if (req.body) {
    req.body = clean(req.body);
  }
  if (req.query) {
    req.query = clean(req.query);
  }
  if (req.params) {
    req.params = clean(req.params);
  }
  next();
};
