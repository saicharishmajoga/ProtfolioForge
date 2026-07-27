import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { catchAsync } from '../utils/catch-async';
import { sendSuccess } from '../utils/response-formatter';
import prisma from '../database/prisma';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validator';
import { BadRequestError } from '../utils/custom-errors';

export class AuthController {
  register = catchAsync(async (req: Request, res: Response) => {
    const validated = registerSchema.parse(req.body);
    const data = await authService.register(validated);
    return sendSuccess(res, data, 'User registered successfully', 201);
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const validated = loginSchema.parse(req.body);
    const data = await authService.login(validated);
    return sendSuccess(res, data, 'User logged in successfully', 200);
  });

  refresh = catchAsync(async (req: Request, res: Response) => {
    const validated = refreshTokenSchema.parse(req.body);
    const data = await authService.refresh(validated.refreshToken);
    return sendSuccess(res, data, 'Token refreshed successfully', 200);
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    const validated = refreshTokenSchema.parse(req.body);
    await authService.logout(validated.refreshToken);
    return sendSuccess(res, null, 'User logged out successfully', 200);
  });

  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const validated = forgotPasswordSchema.parse(req.body);
    const data = await authService.forgotPassword(validated.email);
    return sendSuccess(res, data, 'Password reset instructions sent', 200);
  });

  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const validated = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(validated.token, validated.newPassword);
    return sendSuccess(res, null, 'Password reset completed successfully', 200);
  });

  changePassword = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }
    const validated = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.user.id, validated);
    return sendSuccess(res, null, 'Password changed successfully', 200);
  });

  getSyncData = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        savedPortfolios: true,
        activeDraft: true,
      }
    });
    return sendSuccess(res, user, 'Sync data fetched successfully', 200);
  });

  saveSyncData = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }
    const { savedPortfolios, activeDraft } = req.body;
    
    const updateData: any = {};
    if (savedPortfolios !== undefined) updateData.savedPortfolios = savedPortfolios;
    if (activeDraft !== undefined) updateData.activeDraft = activeDraft;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
      }
    });
    return sendSuccess(res, user, 'Sync data saved successfully', 200);
  });
}

export const authController = new AuthController();
