import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load env files
dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.string().transform((val) => parseInt(val, 10)).default('900000'),
  RATE_LIMIT_MAX: z.string().transform((val) => parseInt(val, 10)).default('100'),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE_MB: z.string().transform((val) => parseInt(val, 10)).default('5'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

// Absolute path to upload folder
export const UPLOAD_PATH = path.resolve(process.cwd(), env.UPLOAD_DIR);
export const MAX_FILE_SIZE = env.MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
