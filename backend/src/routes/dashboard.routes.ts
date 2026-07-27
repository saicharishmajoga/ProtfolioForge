import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, dashboardController.getOverview);

export default router;
