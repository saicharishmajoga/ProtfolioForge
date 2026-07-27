import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../utils/custom-errors';
import { ALLOWED_IMAGE_TYPES, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../config/env';

// Memory storage keeps file buffers in memory before saving them via IStorageService
const storage = multer.memoryStorage();

const imageFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new BadRequestError('Only image files (JPEG, PNG, WEBP) are allowed'));
  }
};

const documentFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new BadRequestError('Only resume files (PDF, DOCX) are allowed'));
  }
};

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for images
  },
  fileFilter: imageFilter,
});

export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // 5MB limit from env config
  },
  fileFilter: documentFilter,
});
