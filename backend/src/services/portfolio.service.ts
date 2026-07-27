import { portfolioRepository, PortfolioRepository } from '../repositories/portfolio.repository';
import { activityLogRepository, ActivityLogRepository } from '../repositories/activity-log.repository';
import { generateUniqueSlug } from '../utils/slug-generator';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/custom-errors';
import prisma from '../database/prisma';
import { logger } from '../config/logger';

export class PortfolioService {
  constructor(
    private portfolioRepo: PortfolioRepository,
    private logRepo: ActivityLogRepository
  ) {}

  // Helper to secure portfolio endpoints
  private async verifyOwnership(portfolioId: string, userId: string): Promise<any> {
    const portfolio = await this.portfolioRepo.findById(portfolioId);

    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    if (portfolio.userId !== userId) {
      throw new ForbiddenError('You do not own this portfolio');
    }

    return portfolio;
  }

  async createPortfolio(userId: string, title: string) {
    const slug = await generateUniqueSlug(title);
    const portfolio = await this.portfolioRepo.create(userId, title, slug);

    await this.logRepo.create(userId, 'PORTFOLIO_CREATED', `Created portfolio: ${title}`);
    logger.info(`Portfolio created for user ${userId}: ${title}`);
    return portfolio;
  }

  async updatePortfolio(id: string, userId: string, title?: string, published?: boolean) {
    await this.verifyOwnership(id, userId);

    const updateData: any = {};
    if (title) {
      updateData.title = title;
      // Regenerate slug on title change
      updateData.slug = await generateUniqueSlug(title, id);
    }
    if (published !== undefined) {
      updateData.published = published;
    }

    const updated = await this.portfolioRepo.update(id, userId, updateData);

    if (published !== undefined) {
      const action = published ? 'PORTFOLIO_PUBLISHED' : 'PORTFOLIO_UNPUBLISHED';
      const desc = published ? `Published portfolio: ${updated.title}` : `Unpublished portfolio: ${updated.title}`;
      await this.logRepo.create(userId, action, desc);
    }

    logger.info(`Portfolio ${id} updated by user ${userId}`);
    return updated;
  }

  async deletePortfolio(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    const deleted = await this.portfolioRepo.delete(id, userId);
    await this.logRepo.create(userId, 'PORTFOLIO_DELETED', `Deleted portfolio: ${deleted.title}`);
    logger.info(`Portfolio ${id} deleted by user ${userId}`);
    return deleted;
  }

  async duplicatePortfolio(id: string, userId: string) {
    const source = await this.verifyOwnership(id, userId);
    const newSlug = await generateUniqueSlug(`${source.title} Copy`);
    const duplicated = await this.portfolioRepo.duplicate(id, userId, newSlug);

    await this.logRepo.create(userId, 'PORTFOLIO_DUPLICATED', `Duplicated portfolio: ${source.title}`);
    logger.info(`Portfolio ${id} duplicated as ${duplicated.id} for user ${userId}`);
    return duplicated;
  }

  async getPortfolio(id: string, userId: string) {
    const portfolio = await this.portfolioRepo.findById(id, userId);
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }
    return portfolio;
  }

  async getPublicPortfolio(slug: string) {
    const portfolio = await this.portfolioRepo.findBySlug(slug);
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found or is private');
    }
    
    if (!portfolio.published) {
      throw new ForbiddenError('This portfolio is currently a draft');
    }

    // Increment view count asynchronously
    await this.portfolioRepo.incrementViews(slug);
    return portfolio;
  }

  async getPortfolios(userId: string, page: number, limit: number) {
    return this.portfolioRepo.findAllByUserId(userId, { page, limit });
  }

  // 1-to-1 Sections Updates
  async updateTheme(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.theme.update({
      where: { portfolioId },
      data,
    });
  }

  async updateProfile(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.profileSection.update({
      where: { portfolioId },
      data,
    });
  }

  async updateAbout(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.aboutSection.update({
      where: { portfolioId },
      data,
    });
  }

  async updateContact(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.contactSection.update({
      where: { portfolioId },
      data,
    });
  }

  async updateSocialLinks(portfolioId: string, userId: string, links: Array<{ platform: string; url: string }>) {
    await this.verifyOwnership(portfolioId, userId);

    return prisma.$transaction(async (tx) => {
      // Re-create all links transactionally
      await tx.socialLink.deleteMany({ where: { portfolioId } });
      
      const created = await tx.socialLink.createMany({
        data: links.map((l) => ({
          portfolioId,
          platform: l.platform,
          url: l.url,
        })),
      });
      return created;
    });
  }

  // Skills
  async addSkill(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.skill.create({
      data: { ...data, portfolioId },
    });
  }

  async updateSkill(id: string, portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.skill.update({
      where: { id, portfolioId },
      data,
    });
  }

  async deleteSkill(id: string, portfolioId: string, userId: string) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.skill.delete({
      where: { id, portfolioId },
    });
  }

  async reorderSkills(portfolioId: string, userId: string, ids: string[]) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.$transaction(
      ids.map((id, index) =>
        prisma.skill.update({
          where: { id, portfolioId },
          data: { orderIndex: index },
        })
      )
    );
  }

  // Projects
  async addProject(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.project.create({
      data: { ...data, portfolioId },
    });
  }

  async updateProject(id: string, portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.project.update({
      where: { id, portfolioId },
      data,
    });
  }

  async deleteProject(id: string, portfolioId: string, userId: string) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.project.delete({
      where: { id, portfolioId },
    });
  }

  async reorderProjects(portfolioId: string, userId: string, ids: string[]) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.$transaction(
      ids.map((id, index) =>
        prisma.project.update({
          where: { id, portfolioId },
          data: { orderIndex: index },
        })
      )
    );
  }

  // Experiences
  async addExperience(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.experience.create({
      data: { ...data, portfolioId },
    });
  }

  async updateExperience(id: string, portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.experience.update({
      where: { id, portfolioId },
      data,
    });
  }

  async deleteExperience(id: string, portfolioId: string, userId: string) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.experience.delete({
      where: { id, portfolioId },
    });
  }

  async reorderExperiences(portfolioId: string, userId: string, ids: string[]) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.$transaction(
      ids.map((id, index) =>
        prisma.experience.update({
          where: { id, portfolioId },
          data: { orderIndex: index },
        })
      )
    );
  }

  // Education
  async addEducation(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.education.create({
      data: { ...data, portfolioId },
    });
  }

  async updateEducation(id: string, portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.education.update({
      where: { id, portfolioId },
      data,
    });
  }

  async deleteEducation(id: string, portfolioId: string, userId: string) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.education.delete({
      where: { id, portfolioId },
    });
  }

  async reorderEducations(portfolioId: string, userId: string, ids: string[]) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.$transaction(
      ids.map((id, index) =>
        prisma.education.update({
          where: { id, portfolioId },
          data: { orderIndex: index },
        })
      )
    );
  }

  // Certificates
  async addCertificate(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.certificate.create({
      data: { ...data, portfolioId },
    });
  }

  async updateCertificate(id: string, portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.certificate.update({
      where: { id, portfolioId },
      data,
    });
  }

  async deleteCertificate(id: string, portfolioId: string, userId: string) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.certificate.delete({
      where: { id, portfolioId },
    });
  }

  async reorderCertificates(portfolioId: string, userId: string, ids: string[]) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.$transaction(
      ids.map((id, index) =>
        prisma.certificate.update({
          where: { id, portfolioId },
          data: { orderIndex: index },
        })
      )
    );
  }

  // Achievements
  async addAchievement(portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.achievement.create({
      data: { ...data, portfolioId },
    });
  }

  async updateAchievement(id: string, portfolioId: string, userId: string, data: any) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.achievement.update({
      where: { id, portfolioId },
      data,
    });
  }

  async deleteAchievement(id: string, portfolioId: string, userId: string) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.achievement.delete({
      where: { id, portfolioId },
    });
  }

  async reorderAchievements(portfolioId: string, userId: string, ids: string[]) {
    await this.verifyOwnership(portfolioId, userId);
    return prisma.$transaction(
      ids.map((id, index) =>
        prisma.achievement.update({
          where: { id, portfolioId },
          data: { orderIndex: index },
        })
      )
    );
  }
}

export const portfolioService = new PortfolioService(portfolioRepository, activityLogRepository);
