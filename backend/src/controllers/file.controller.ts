import { Request, Response } from 'express';
import path from 'path';
import { storageService } from '../services/storage/local-storage.service';
import { resumeParser } from '../services/parser/simple-resume-parser';
import { userRepository } from '../repositories/user.repository';
import { catchAsync } from '../utils/catch-async';
import { sendSuccess } from '../utils/response-formatter';
import { BadRequestError } from '../utils/custom-errors';
import { UPLOAD_PATH } from '../config/env';

export class FileController {
  uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('No image file uploaded');
    }
    
    // Save to local storage under 'profiles'
    const relativeUrl = await storageService.saveFile(req.file, 'profiles');
    
    // Optionally link to the authenticated user profile automatically
    if (req.user) {
      await userRepository.update(req.user.id, { profileImage: relativeUrl });
    }

    return sendSuccess(res, { imageUrl: relativeUrl }, 'Profile image uploaded successfully', 200);
  });

  uploadProjectImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('No image file uploaded');
    }

    const relativeUrl = await storageService.saveFile(req.file, 'projects');
    return sendSuccess(res, { imageUrl: relativeUrl }, 'Project image uploaded successfully', 200);
  });

  uploadCertificateImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('No image file uploaded');
    }

    const relativeUrl = await storageService.saveFile(req.file, 'certificates');
    return sendSuccess(res, { imageUrl: relativeUrl }, 'Certificate image uploaded successfully', 200);
  });

  uploadResume = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError('No resume file uploaded');
    }

    // 1. Save file locally
    const relativeUrl = await storageService.saveFile(req.file, 'resumes');

    // 2. Compute absolute path to pass to the parser pipeline
    const fileName = path.basename(relativeUrl);
    const absolutePath = path.join(UPLOAD_PATH, 'resumes', fileName);

    // 3. Parse resume text
    const parsedData = await resumeParser.parse(absolutePath);

    return sendSuccess(
      res, 
      { fileUrl: relativeUrl, parsedData },
      'Resume uploaded and parsed successfully',
      200
    );
  });
}

export const fileController = new FileController();
