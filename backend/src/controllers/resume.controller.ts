import { Request, Response } from 'express';
import { z } from 'zod';
import { resumeGenerator } from '../services/resume/pdf-resume-generator';
import { portfolioRepository } from '../repositories/portfolio.repository';
import { activityLogRepository } from '../repositories/activity-log.repository';
import { catchAsync } from '../utils/catch-async';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/custom-errors';
import { logger } from '../config/logger';

const generateSchema = z.object({
  portfolioId: z.string().uuid('Invalid portfolio ID format'),
  templateId: z.enum(['classic', 'modern']).default('classic'),
});

export class ResumeController {
  generate = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }

    const validated = generateSchema.parse(req.body);
    
    // 1. Fetch complete portfolio data
    const portfolio = await portfolioRepository.findById(validated.portfolioId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    // 2. Security validation: Verify the user owns the portfolio
    if (portfolio.userId !== req.user.id) {
      throw new ForbiddenError('You do not own this portfolio');
    }

    // 3. Set PDF response headers
    const sanitizedTitle = portfolio.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume_${sanitizedTitle}.pdf"`);

    // 4. Log the event
    await activityLogRepository.create(
      req.user.id,
      'RESUME_GENERATION',
      `Generated PDF resume using template: ${validated.templateId}`
    );

    // 5. Generate and stream the PDF response
    await resumeGenerator.generate(portfolio, validated.templateId, res);
  });
}

export const resumeController = new ResumeController();
export default resumeController;
