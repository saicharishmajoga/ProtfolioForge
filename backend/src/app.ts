import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { env, UPLOAD_PATH } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { globalLimiter } from './middleware/rate-limiter.middleware';
import { sanitizeInput } from './middleware/sanitize.middleware';
import { NotFoundError } from './utils/custom-errors';

// Route Imports
import authRoutes from './routes/auth.routes';
import portfolioRoutes from './routes/portfolio.routes';
import fileRoutes from './routes/file.routes';
import dashboardRoutes from './routes/dashboard.routes';
import resumeRoutes from './routes/resume.routes';

const app = express();

// 1. Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows images served statically to be accessed by external origins
}));

// 2. CORS configuration
app.use(cors({
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Global rate limiting
app.use(globalLimiter);

// 4. Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Input Sanitization against XSS
app.use(sanitizeInput);

// 6. Serve static uploads folder (profile images, project screenshots, certificates)
app.use('/uploads', express.static(UPLOAD_PATH));

// 7. Swagger Documentation Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 8. API Router Registration
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resumes', resumeRoutes);

// Root path indicator
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to the PortfolioForge REST API',
    docs: '/api-docs',
    status: 'operational',
  });
});

// 9. Wildcard 404 handler for unmatched routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// 10. Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
export { app };
