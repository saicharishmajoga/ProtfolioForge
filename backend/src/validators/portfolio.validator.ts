import { z } from 'zod';

export const createPortfolioSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
});

export const updatePortfolioSchema = z.object({
  title: z.string().min(2).optional(),
  published: z.boolean().optional(),
});

export const updateThemeSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid hex color').optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid hex color').optional(),
  font: z.string().min(1).optional(),
  layout: z.string().min(1).optional(),
  darkMode: z.boolean().optional(),
  animations: z.boolean().optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  title: z.string().min(1, 'Professional title is required'),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().url('Invalid URL').or(z.string().regex(/^\/uploads\//)).nullable().optional(),
});

export const updateAboutSchema = z.object({
  text: z.string().min(1, 'Biography text is required'),
  subHeading: z.string().nullable().optional(),
});

export const updateContactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().nullable().optional(),
  website: z.string().url('Invalid URL').or(z.literal('')).nullable().optional(),
  location: z.string().nullable().optional(),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  url: z.string().url('Invalid URL'),
});

export const updateSocialLinksSchema = z.array(socialLinkSchema);
