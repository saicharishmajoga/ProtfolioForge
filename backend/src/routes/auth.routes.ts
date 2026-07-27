import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limiter.middleware';

const router = Router();

// Public routes (rate limited)
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

// Protected routes
router.post('/change-password', requireAuth, authController.changePassword);
router.get('/sync', requireAuth, authController.getSyncData);
router.post('/sync', requireAuth, authController.saveSyncData);

export default router;
