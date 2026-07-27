import { Request, Response } from 'express';
import { portfolioService } from '../services/portfolio.service';
import { catchAsync } from '../utils/catch-async';
import { sendSuccess } from '../utils/response-formatter';
import {
  createPortfolioSchema,
  updatePortfolioSchema,
  updateThemeSchema,
  updateProfileSchema,
  updateAboutSchema,
  updateContactSchema,
  updateSocialLinksSchema,
} from '../validators/portfolio.validator';
import { BadRequestError } from '../utils/custom-errors';

export class PortfolioController {
  create = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const validated = createPortfolioSchema.parse(req.body);
    const data = await portfolioService.createPortfolio(req.user.id, validated.title);
    return sendSuccess(res, data, 'Portfolio created successfully', 201);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { id } = req.params;
    const validated = updatePortfolioSchema.parse(req.body);
    const data = await portfolioService.updatePortfolio(id, req.user.id, validated.title, validated.published);
    return sendSuccess(res, data, 'Portfolio updated successfully', 200);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { id } = req.params;
    await portfolioService.deletePortfolio(id, req.user.id);
    return sendSuccess(res, null, 'Portfolio deleted successfully', 200);
  });

  getOne = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { id } = req.params;
    const data = await portfolioService.getPortfolio(id, req.user.id);
    return sendSuccess(res, data, 'Portfolio fetched successfully', 200);
  });

  getList = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '10', 10);
    const data = await portfolioService.getPortfolios(req.user.id, page, limit);
    return sendSuccess(res, data, 'Portfolios fetched successfully', 200);
  });

  getPublic = catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const data = await portfolioService.getPublicPortfolio(slug);
    return sendSuccess(res, data, 'Public portfolio fetched successfully', 200);
  });

  duplicate = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { id } = req.params;
    const data = await portfolioService.duplicatePortfolio(id, req.user.id);
    return sendSuccess(res, data, 'Portfolio duplicated successfully', 201);
  });

  // Section details
  updateTheme = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = updateThemeSchema.parse(req.body);
    const data = await portfolioService.updateTheme(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Theme updated successfully', 200);
  });

  updateProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = updateProfileSchema.parse(req.body);
    const data = await portfolioService.updateProfile(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Profile updated successfully', 200);
  });

  updateAbout = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = updateAboutSchema.parse(req.body);
    const data = await portfolioService.updateAbout(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'About section updated successfully', 200);
  });

  updateContact = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = updateContactSchema.parse(req.body);
    const data = await portfolioService.updateContact(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Contact details updated successfully', 200);
  });

  updateSocialLinks = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = updateSocialLinksSchema.parse(req.body);
    const data = await portfolioService.updateSocialLinks(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Social links updated successfully', 200);
  });
}

export const portfolioController = new PortfolioController();
