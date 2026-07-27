import request from 'supertest';
import app from '../src/app';
import { userRepository } from '../src/repositories/user.repository';
import { refreshTokenRepository } from '../src/repositories/refresh-token.repository';
import bcrypt from 'bcryptjs';

// Mock repositories to test the Express routing, validation, error handler, and controllers
jest.mock('../src/repositories/user.repository', () => ({
  userRepository: {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../src/repositories/refresh-token.repository', () => ({
  refreshTokenRepository: {
    create: jest.fn(),
    findByToken: jest.fn(),
    deleteByToken: jest.fn(),
    deleteByUserId: jest.fn(),
  },
}));

jest.mock('../src/repositories/activity-log.repository', () => ({
  activityLogRepository: {
    create: jest.fn(),
    findRecentByUserId: jest.fn(),
  },
}));

describe('🔑 Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return tokens', async () => {
      const mockUser = {
        id: 'user-uuid-1234',
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedpassword',
        role: 'USER',
        profileImage: null,
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue(mockUser);
      (refreshTokenRepository.create as jest.Mock).mockResolvedValue({ token: 'mock-refresh' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('jane@example.com');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should fail registration if validation fails (e.g., short password)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: '123', // Too short (min 6 required)
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should fail registration if email already exists', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 'user-1' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return JWT tokens', async () => {
      const mockUser = {
        id: 'user-uuid-1234',
        name: 'Jane Doe',
        email: 'jane@example.com',
        // 'password123' bcrypt hashed with 10 salt rounds
        password: bcrypt.hashSync('password123', 10), 
        role: 'USER',
        profileImage: null,
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject invalid credentials', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
