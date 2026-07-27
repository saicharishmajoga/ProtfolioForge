import { Router } from 'express';
import { fileController } from '../controllers/file.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { uploadImage, uploadDocument } from '../middleware/upload.middleware';

const router = Router();

// Protect all upload endpoints
router.use(requireAuth);

router.post('/upload/profile', uploadImage.single('file'), fileController.uploadProfileImage);
router.post('/upload/project', uploadImage.single('file'), fileController.uploadProjectImage);
router.post('/upload/certificate', uploadImage.single('file'), fileController.uploadCertificateImage);
router.post('/upload/resume', uploadDocument.single('file'), fileController.uploadResume);

export default router;
