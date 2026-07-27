import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IStorageService } from './storage.interface';
import { env, UPLOAD_PATH } from '../../config/env';
import { logger } from '../../config/logger';

export class LocalStorageService implements IStorageService {
  constructor() {
    // Ensure root upload folder exists
    if (!fs.existsSync(UPLOAD_PATH)) {
      fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const targetDir = path.join(UPLOAD_PATH, folder);

    // Ensure subdirectory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Sanitize filename and prepend a unique hash to prevent overwrite collisions
    const fileExt = path.extname(file.originalname);
    const sanitizedBase = path.basename(file.originalname, fileExt)
      .replace(/[^a-zA-Z0-9]/g, '_'); // alphanumeric + underscore only
    const uniqueHash = crypto.randomBytes(8).toString('hex');
    const secureFileName = `${Date.now()}_${uniqueHash}_${sanitizedBase}${fileExt}`;
    
    const targetPath = path.join(targetDir, secureFileName);

    // Save the file buffer
    await fs.promises.writeFile(targetPath, file.buffer);

    // Return the relative URL path to be stored in the DB (e.g. /uploads/profiles/17234..._image.png)
    const relativePath = `/uploads/${folder}/${secureFileName}`;
    logger.info(`File saved locally: ${relativePath}`);
    return relativePath;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Expecting local path starting with /uploads/
    if (!fileUrl.startsWith('/uploads/')) {
      logger.warn(`Attempted to delete file with non-local path format: ${fileUrl}`);
      return;
    }

    // Convert relative URL path back to absolute local filesystem path
    const relativeFilePath = fileUrl.replace('/uploads/', '');
    const absolutePath = path.join(UPLOAD_PATH, relativeFilePath);

    try {
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        logger.info(`File deleted locally: ${absolutePath}`);
      } else {
        logger.warn(`File to delete not found locally: ${absolutePath}`);
      }
    } catch (error: any) {
      logger.error(`Error deleting local file ${absolutePath}: ${error.message}`);
    }
  }
}

export const storageService = new LocalStorageService();
