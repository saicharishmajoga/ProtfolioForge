import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().nullable().optional(),
  experienceLevel: z.string().nullable().optional(),
  years: z.number().nonnegative('Years must be positive').nullable().optional(),
  orderIndex: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Project description is required'),
  imageUrl: z.string().nullable().optional(),
  liveUrl: z.string().url('Invalid URL').or(z.literal('')).nullable().optional(),
  githubUrl: z.string().url('Invalid URL').or(z.literal('')).nullable().optional(),
  orderIndex: z.number().int().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position title is required'),
  description: z.string().nullable().optional(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)).nullable().optional(),
  currentlyWorking: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
});

export const educationSchema = z.object({
  college: z.string().min(1, 'College/School name is required'),
  degree: z.string().min(1, 'Degree name is required'),
  cgpa: z.number().nonnegative().max(10).nullable().optional(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)).nullable().optional(),
  orderIndex: z.number().int().default(0),
});

export const certificateSchema = z.object({
  name: z.string().min(1, 'Certificate name is required'),
  issuer: z.string().min(1, 'Issuer name is required'),
  date: z.string().transform((val) => new Date(val)).nullable().optional(),
  credentialUrl: z.string().url('Invalid URL').or(z.literal('')).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  orderIndex: z.number().int().default(0),
});

export const achievementSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().nullable().optional(),
  date: z.string().transform((val) => new Date(val)).nullable().optional(),
  orderIndex: z.number().int().default(0),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().uuid('Invalid ID format')),
});
