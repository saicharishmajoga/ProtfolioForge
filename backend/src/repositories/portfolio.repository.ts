import { Prisma, Portfolio } from '@prisma/client';
import prisma from '../database/prisma';
import { NotFoundError } from '../utils/custom-errors';

export class PortfolioRepository {
  async create(userId: string, title: string, slug: string): Promise<Portfolio> {
    // Create portfolio along with default theme, profile, about and contact sections in a transaction
    return prisma.$transaction(async (tx) => {
      const portfolio = await tx.portfolio.create({
        data: {
          userId,
          title,
          slug,
          theme: {
            create: {}, // Defaults from schema
          },
          profile: {
            create: {
              fullName: '',
              title: '',
            },
          },
          about: {
            create: {
              text: '',
            },
          },
          contact: {
            create: {
              email: '',
            },
          },
        },
        include: {
          theme: true,
          profile: true,
          about: true,
          contact: true,
        },
      });
      return portfolio;
    });
  }

  async findById(id: string, userId?: string): Promise<any> {
    const whereClause: Prisma.PortfolioWhereUniqueInput = userId
      ? { id, userId }
      : { id };

    return prisma.portfolio.findFirst({
      where: whereClause,
      include: {
        theme: true,
        profile: true,
        about: true,
        contact: true,
        skills: { orderBy: { orderIndex: 'asc' } },
        projects: { orderBy: { orderIndex: 'asc' } },
        experiences: { orderBy: { orderIndex: 'asc' } },
        educations: { orderBy: { orderIndex: 'asc' } },
        certificates: { orderBy: { orderIndex: 'asc' } },
        achievements: { orderBy: { orderIndex: 'asc' } },
        socialLinks: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<any> {
    return prisma.portfolio.findUnique({
      where: { slug },
      include: {
        theme: true,
        profile: true,
        about: true,
        contact: true,
        skills: { orderBy: { orderIndex: 'asc' } },
        projects: { orderBy: { orderIndex: 'asc' } },
        experiences: { orderBy: { orderIndex: 'asc' } },
        educations: { orderBy: { orderIndex: 'asc' } },
        certificates: { orderBy: { orderIndex: 'asc' } },
        achievements: { orderBy: { orderIndex: 'asc' } },
        socialLinks: true,
      },
    });
  }

  async update(id: string, userId: string, data: Prisma.PortfolioUpdateInput): Promise<Portfolio> {
    return prisma.portfolio.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Portfolio> {
    return prisma.portfolio.delete({
      where: { id, userId },
    });
  }

  async findAllByUserId(
    userId: string,
    options: { page: number; limit: number }
  ): Promise<{ portfolios: Portfolio[]; total: number }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          theme: true,
          profile: true,
        },
      }),
      prisma.portfolio.count({
        where: { userId },
      }),
    ]);

    return { portfolios, total };
  }

  async getDashboardStats(userId: string): Promise<{
    totalPortfolios: number;
    publishedCount: number;
    draftCount: number;
    totalViews: number;
  }> {
    const [totalPortfolios, publishedCount, draftCount, viewsAggregate] = await Promise.all([
      prisma.portfolio.count({ where: { userId } }),
      prisma.portfolio.count({ where: { userId, published: true } }),
      prisma.portfolio.count({ where: { userId, published: false } }),
      prisma.portfolio.aggregate({
        where: { userId },
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPortfolios,
      publishedCount,
      draftCount,
      totalViews: viewsAggregate._sum.views || 0,
    };
  }

  async incrementViews(slug: string): Promise<Portfolio | null> {
    try {
      return await prisma.portfolio.update({
        where: { slug },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    } catch {
      return null;
    }
  }

  async duplicate(id: string, userId: string, newSlug: string): Promise<Portfolio> {
    const source = await this.findById(id, userId);
    if (!source) {
      throw new NotFoundError('Source portfolio not found');
    }

    return prisma.$transaction(async (tx) => {
      // 1. Create the new portfolio root
      const duplicated = await tx.portfolio.create({
        data: {
          userId,
          title: `${source.title} (Copy)`,
          slug: newSlug,
          published: false, // Default to unpublished copy
        },
      });

      // 2. Clone Theme
      if (source.theme) {
        await tx.theme.create({
          data: {
            portfolioId: duplicated.id,
            primaryColor: source.theme.primaryColor,
            accentColor: source.theme.accentColor,
            font: source.theme.font,
            layout: source.theme.layout,
            darkMode: source.theme.darkMode,
            animations: source.theme.animations,
          },
        });
      } else {
        await tx.theme.create({ data: { portfolioId: duplicated.id } });
      }

      // 3. Clone ProfileSection
      if (source.profile) {
        await tx.profileSection.create({
          data: {
            portfolioId: duplicated.id,
            fullName: source.profile.fullName,
            title: source.profile.title,
            bio: source.profile.bio,
            avatarUrl: source.profile.avatarUrl,
          },
        });
      }

      // 4. Clone AboutSection
      if (source.about) {
        await tx.aboutSection.create({
          data: {
            portfolioId: duplicated.id,
            text: source.about.text,
            subHeading: source.about.subHeading,
          },
        });
      }

      // 5. Clone ContactSection
      if (source.contact) {
        await tx.contactSection.create({
          data: {
            portfolioId: duplicated.id,
            email: source.contact.email,
            phone: source.contact.phone,
            website: source.contact.website,
            location: source.contact.location,
          },
        });
      }

      // 6. Clone Social Links
      if (source.socialLinks && source.socialLinks.length > 0) {
        await tx.socialLink.createMany({
          data: source.socialLinks.map((link: any) => ({
            portfolioId: duplicated.id,
            platform: link.platform,
            url: link.url,
          })),
        });
      }

      // 7. Clone Skills
      if (source.skills && source.skills.length > 0) {
        await tx.skill.createMany({
          data: source.skills.map((skill: any) => ({
            portfolioId: duplicated.id,
            name: skill.name,
            category: skill.category,
            experienceLevel: skill.experienceLevel,
            years: skill.years,
            orderIndex: skill.orderIndex,
          })),
        });
      }

      // 8. Clone Projects
      if (source.projects && source.projects.length > 0) {
        await tx.project.createMany({
          data: source.projects.map((proj: any) => ({
            portfolioId: duplicated.id,
            title: proj.title,
            description: proj.description,
            imageUrl: proj.imageUrl,
            liveUrl: proj.liveUrl,
            githubUrl: proj.githubUrl,
            orderIndex: proj.orderIndex,
          })),
        });
      }

      // 9. Clone Experiences
      if (source.experiences && source.experiences.length > 0) {
        await tx.experience.createMany({
          data: source.experiences.map((exp: any) => ({
            portfolioId: duplicated.id,
            company: exp.company,
            position: exp.position,
            description: exp.description,
            startDate: exp.startDate,
            endDate: exp.endDate,
            currentlyWorking: exp.currentlyWorking,
            orderIndex: exp.orderIndex,
          })),
        });
      }

      // 10. Clone Educations
      if (source.educations && source.educations.length > 0) {
        await tx.education.createMany({
          data: source.educations.map((edu: any) => ({
            portfolioId: duplicated.id,
            college: edu.college,
            degree: edu.degree,
            cgpa: edu.cgpa,
            startDate: edu.startDate,
            endDate: edu.endDate,
            orderIndex: edu.orderIndex,
          })),
        });
      }

      // 11. Clone Certificates
      if (source.certificates && source.certificates.length > 0) {
        await tx.certificate.createMany({
          data: source.certificates.map((cert: any) => ({
            portfolioId: duplicated.id,
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            credentialUrl: cert.credentialUrl,
            imageUrl: cert.imageUrl,
            orderIndex: cert.orderIndex,
          })),
        });
      }

      // 12. Clone Achievements
      if (source.achievements && source.achievements.length > 0) {
        await tx.achievement.createMany({
          data: source.achievements.map((ach: any) => ({
            portfolioId: duplicated.id,
            title: ach.title,
            description: ach.description,
            date: ach.date,
            orderIndex: ach.orderIndex,
          })),
        });
      }

      return duplicated;
    });
  }
}
export const portfolioRepository = new PortfolioRepository();
