import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { catchAsync } from '../utils/catch-async';
import { sendSuccess } from '../utils/response-formatter';
import { BadRequestError } from '../utils/custom-errors';

export class DashboardController {
  getOverview = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User context not found');
    }
    const data = await dashboardService.getDashboardData(req.user.id);
    return sendSuccess(res, data, 'Dashboard overview fetched successfully', 200);
  });
}

export const dashboardController = new DashboardController();
export default dashboardController;
