import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import { env } from '../src/config/env';
import { portfolioRepository } from '../src/repositories/portfolio.repository';

// Mock repositories
jest.mock('../src/repositories/portfolio.repository', () => ({
  portfolioRepository: {
    create: jest.fn(),
    findById: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAllByUserId: jest.fn(),
    duplicate: jest.fn(),
  },
}));

jest.mock('../src/repositories/activity-log.repository', () => ({
  activityLogRepository: {
    create: jest.fn(),
  },
}));

jest.mock('../src/utils/slug-generator', () => ({
  generateUniqueSlug: jest.fn().mockImplementation((title) => Promise.resolve(title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))),
}));

const mockUserId = 'user-uuid-1234';
const mockToken = jwt.sign(
  { id: mockUserId, email: 'jane@example.com', name: 'Jane Doe', role: 'USER' },
  env.JWT_ACCESS_SECRET,
  { expiresIn: '1h' }
);

describe('📁 Portfolio Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/portfolios', () => {
    it('should create a new portfolio', async () => {
      const mockPortfolio = {
        id: 'portfolio-uuid-999',
        userId: mockUserId,
        title: 'New Web Dev Portfolio',
        slug: 'new-web-dev-portfolio',
        published: false,
      };

      (portfolioRepository.create as jest.Mock).mockResolvedValue(mockPortfolio);

      const response = await request(app)
        .post('/api/portfolios')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ title: 'New Web Dev Portfolio' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('new-web-dev-portfolio');
    });

    it('should block request if authorization token is missing', async () => {
      const response = await request(app)
        .post('/api/portfolios')
        .send({ title: 'New Web Dev Portfolio' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token is missing');
    });
  });

  describe('GET /api/portfolios/:id', () => {
    it('should return a portfolio detail including sections', async () => {
      const mockPortfolio = {
        id: 'portfolio-uuid-123',
        userId: mockUserId,
        title: 'Jane Portfolio',
        slug: 'jane-portfolio',
        published: true,
        theme: { primaryColor: '#000000' },
        profile: { fullName: 'Jane Doe', title: 'Tech Lead' },
        skills: [],
      };

      (portfolioRepository.findById as jest.Mock).mockResolvedValue(mockPortfolio);

      const response = await request(app)
        .get('/api/portfolios/portfolio-uuid-123')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Jane Portfolio');
      expect(response.body.data.profile.fullName).toBe('Jane Doe');
    });
  });

  describe('POST /api/portfolios/:id/duplicate', () => {
    it('should call duplicate in repository', async () => {
      const mockSourcePortfolio = {
        id: 'portfolio-uuid-123',
        userId: mockUserId,
        title: 'Source Title',
      };
      
      const mockDuplicatedPortfolio = {
        id: 'portfolio-uuid-456',
        userId: mockUserId,
        title: 'Source Title (Copy)',
        slug: 'source-title-copy',
      };

      // Mock findById in service to verify ownership
      (portfolioRepository.findById as jest.Mock).mockResolvedValue(mockSourcePortfolio);
      (portfolioRepository.duplicate as jest.Mock).mockResolvedValue(mockDuplicatedPortfolio);

      const response = await request(app)
        .post('/api/portfolios/portfolio-uuid-123/duplicate')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Source Title (Copy)');
    });
  });
});
