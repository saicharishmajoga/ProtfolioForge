import prisma from '../database/prisma';
import { portfolioRepository } from '../repositories/portfolio.repository';
import { activityLogRepository } from '../repositories/activity-log.repository';
import { logger } from '../config/logger';

export class DashboardService {
  async getDashboardData(userId: string) {
    logger.info(`Fetching dashboard metrics for user: ${userId}`);

    // 1. Get counts & views
    const stats = await portfolioRepository.getDashboardStats(userId);

    // 2. Fetch 5 recent portfolios
    const recentPortfolios = await prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        theme: true,
        profile: true,
      },
    });

    // 3. Fetch recent user activities
    const recentActivity = await activityLogRepository.findRecentByUserId(userId, 5);

    // 4. Calculate Profile Completion Score for the most recently updated portfolio
    let profileCompletion = 0;
    const latestPortfolio = recentPortfolios[0]
      ? await prisma.portfolio.findUnique({
          where: { id: recentPortfolios[0].id },
          include: {
            profile: true,
            about: true,
            contact: true,
            skills: true,
            projects: true,
            experiences: true,
            educations: true,
            certificates: true,
          },
        })
      : null;

    if (latestPortfolio) {
      let score = 0;

      // Profile details completed (Max: 20%)
      if (latestPortfolio.profile?.fullName) score += 10;
      if (latestPortfolio.profile?.title) score += 10;

      // About me text completed (Max: 15%)
      if (latestPortfolio.about?.text && latestPortfolio.about.text.trim() !== '') score += 15;

      // Contact details (Max: 20%)
      if (latestPortfolio.contact?.email) score += 10;
      if (latestPortfolio.contact?.phone) score += 5;
      if (latestPortfolio.contact?.location) score += 5;

      // Skills (Max: 15%)
      if (latestPortfolio.skills.length > 0) {
        score += 15;
      }

      // Projects (Max: 10%)
      if (latestPortfolio.projects.length > 0) {
        score += 10;
      }

      // Work Experience (Max: 10%)
      if (latestPortfolio.experiences.length > 0) {
        score += 10;
      }

      // Education (Max: 10%)
      if (latestPortfolio.educations.length > 0) {
        score += 10;
      }

      profileCompletion = score;
    }

    return {
      stats,
      profileCompletion,
      recentPortfolios: recentPortfolios.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        published: p.published,
        views: p.views,
        theme: p.theme,
        profileName: p.profile?.fullName || null,
        updatedAt: p.updatedAt,
      })),
      recentActivity: recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        description: log.description,
        createdAt: log.createdAt,
      })),
    };
  }
}

export const dashboardService = new DashboardService();
