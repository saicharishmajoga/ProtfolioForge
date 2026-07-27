import { Router } from 'express';
import { resumeController } from '../controllers/resume.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', requireAuth, resumeController.generate);

export default router;
