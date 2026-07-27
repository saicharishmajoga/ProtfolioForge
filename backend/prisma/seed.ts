import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing database records
  console.log('🧹 Cleaning database...');
  await prisma.activityLog.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.theme.deleteMany({});
  await prisma.profileSection.deleteMany({});
  await prisma.aboutSection.deleteMany({});
  await prisma.contactSection.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.portfolio.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create seed users
  console.log('👤 Creating seed users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@portfolioforge.com',
      name: 'Admin PortfolioForge',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Created users: ${user1.email} (User), ${adminUser.email} (Admin)`);

  // 3. Create a sample portfolio for John Doe
  console.log('📁 Creating sample portfolio...');
  const portfolio1 = await prisma.portfolio.create({
    data: {
      userId: user1.id,
      title: 'Senior Software Engineer Portfolio',
      slug: 'john-doe',
      published: true,
      views: 128,
    },
  });

  // 4. Create related portfolio sections
  console.log('🎨 Creating portfolio sections...');
  
  // Theme
  await prisma.theme.create({
    data: {
      portfolioId: portfolio1.id,
      primaryColor: '#3B82F6', // Blue
      accentColor: '#10B981',  // Green
      font: 'Inter',
      layout: 'modern',
      darkMode: true,
      animations: true,
    },
  });

  // Profile Section
  await prisma.profileSection.create({
    data: {
      portfolioId: portfolio1.id,
      fullName: 'John Doe',
      title: 'Full Stack Tech Lead',
      bio: 'Building scalable distributed backends and interactive frontend applications.',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
    },
  });

  // About Section
  await prisma.aboutSection.create({
    data: {
      portfolioId: portfolio1.id,
      text: 'I am a passionate software engineer with 7+ years of experience specializing in Node.js, TypeScript, PostgreSQL, and AWS cloud architectures. I love designing clean architectures and mentoring junior developers.',
      subHeading: 'Bridging the gap between engineering and user experiences',
    },
  });

  // Contact Section
  await prisma.contactSection.create({
    data: {
      portfolioId: portfolio1.id,
      email: 'john.doe@example.com',
      phone: '+1 (555) 019-2834',
      website: 'https://johndoe.dev',
      location: 'San Francisco, CA',
    },
  });

  // Social Links
  await prisma.socialLink.createMany({
    data: [
      { portfolioId: portfolio1.id, platform: 'github', url: 'https://github.com/johndoe' },
      { portfolioId: portfolio1.id, platform: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
      { portfolioId: portfolio1.id, platform: 'twitter', url: 'https://twitter.com/johndoe' },
    ],
  });

  // Skills
  console.log('⚡ Populating skills, experiences, projects...');
  await prisma.skill.createMany({
    data: [
      { portfolioId: portfolio1.id, name: 'TypeScript', category: 'Languages', experienceLevel: 'Expert', years: 5.5, orderIndex: 0 },
      { portfolioId: portfolio1.id, name: 'Node.js (Express/NestJS)', category: 'Backend', experienceLevel: 'Expert', years: 6, orderIndex: 1 },
      { portfolioId: portfolio1.id, name: 'PostgreSQL', category: 'Database', experienceLevel: 'Expert', years: 5, orderIndex: 2 },
      { portfolioId: portfolio1.id, name: 'React / Next.js', category: 'Frontend', experienceLevel: 'Intermediate', years: 4, orderIndex: 3 },
      { portfolioId: portfolio1.id, name: 'Docker & Kubernetes', category: 'DevOps', experienceLevel: 'Intermediate', years: 3, orderIndex: 4 },
    ],
  });

  // Projects
  await prisma.project.createMany({
    data: [
      {
        portfolioId: portfolio1.id,
        title: 'PortfolioForge Backend API',
        description: 'Clean Architecture REST API using Express, TypeScript, and Prisma ORM supporting automated resume parsing and PDF generator.',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&h=250&q=80',
        liveUrl: 'https://api.portfolioforge.com',
        githubUrl: 'https://github.com/johndoe/portfolioforge-backend',
        orderIndex: 0,
      },
      {
        portfolioId: portfolio1.id,
        title: 'Distributed Analytics Engine',
        description: 'Real-time clickstream processing engine handling 10k events/sec leveraging Kafka, Redis, and Go.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&h=250&q=80',
        liveUrl: 'https://analytics.johndoe.dev',
        githubUrl: 'https://github.com/johndoe/analytics-engine',
        orderIndex: 1,
      },
    ],
  });

  // Experiences
  await prisma.experience.createMany({
    data: [
      {
        portfolioId: portfolio1.id,
        company: 'TechCorp Solutions',
        position: 'Lead Backend Engineer',
        description: 'Led a team of 4 engineers to rebuild the enterprise legacy billing platform. Improved microservice API latency by 45%. Set up database query optimizations and caching strategies.',
        startDate: new Date('2023-03-01'),
        currentlyWorking: true,
        orderIndex: 0,
      },
      {
        portfolioId: portfolio1.id,
        company: 'DevFlow Systems',
        position: 'Software Engineer II',
        description: 'Developed and maintained core API modules. Integrated third-party payment gateways (Stripe, PayPal) and managed CI/CD pipelines on AWS.',
        startDate: new Date('2020-07-01'),
        endDate: new Date('2023-02-28'),
        currentlyWorking: false,
        orderIndex: 1,
      },
    ],
  });

  // Educations
  await prisma.education.createMany({
    data: [
      {
        portfolioId: portfolio1.id,
        college: 'Stanford University',
        degree: 'M.S. in Computer Science',
        cgpa: 3.9,
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-06-30'),
        orderIndex: 0,
      },
      {
        portfolioId: portfolio1.id,
        college: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science',
        cgpa: 3.8,
        startDate: new Date('2014-09-01'),
        endDate: new Date('2018-06-15'),
        orderIndex: 1,
      },
    ],
  });

  // Certificates
  await prisma.certificate.createMany({
    data: [
      {
        portfolioId: portfolio1.id,
        name: 'AWS Certified Solutions Architect – Professional',
        issuer: 'Amazon Web Services (AWS)',
        date: new Date('2025-01-15'),
        credentialUrl: 'https://aws.amazon.com/verification/exam-id-123',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=150&q=80',
        orderIndex: 0,
      },
    ],
  });

  // Achievements
  await prisma.achievement.createMany({
    data: [
      {
        portfolioId: portfolio1.id,
        title: 'TechCorp Hackathon Winner',
        description: 'First place out of 35 teams for inventing a AI-driven log aggregation and anomaly detection dashboard.',
        date: new Date('2024-05-10'),
        orderIndex: 0,
      },
    ],
  });

  // 5. Activity Logs
  console.log('📝 Creating activity logs...');
  await prisma.activityLog.createMany({
    data: [
      { userId: user1.id, action: 'USER_REGISTER', description: 'Registered a new user account' },
      { userId: user1.id, action: 'PORTFOLIO_CREATED', description: 'Created portfolio: Senior Software Engineer Portfolio' },
      { userId: user1.id, action: 'PORTFOLIO_PUBLISHED', description: 'Published portfolio to unique slug: john-doe' },
    ],
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
