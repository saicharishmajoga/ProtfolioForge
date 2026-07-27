import prisma from '../database/prisma';

/**
 * Generates a unique, URL-safe slug for a portfolio.
 * If the slug is already in use, appends an incrementing counter suffix.
 * @param title The base title or name
 * @param currentPortfolioId Optional ID to exclude from uniqueness check (for updates)
 */
export const generateUniqueSlug = async (
  title: string,
  currentPortfolioId?: string
): Promise<string> => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/[\s_]+/g, '-')       // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')           // Consolidate consecutive hyphens
    .replace(/^-+|-+$/g, '');      // Trim leading/trailing hyphens

  let slug = baseSlug || 'portfolio';
  let isUnique = false;
  let counter = 0;

  while (!isUnique) {
    const testSlug = counter === 0 ? slug : `${slug}-${counter}`;

    const existing = await prisma.portfolio.findFirst({
      where: {
        slug: testSlug,
        NOT: currentPortfolioId ? { id: currentPortfolioId } : undefined,
      },
    });

    if (!existing) {
      slug = testSlug;
      isUnique = true;
    } else {
      counter++;
    }
  }

  return slug;
};
