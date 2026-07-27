import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { refreshTokenRepository, RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { activityLogRepository, ActivityLogRepository } from '../repositories/activity-log.repository';
import { RegisterInput, LoginInput, ChangePasswordInput } from '../validators/auth.validator';
import { ConflictError, UnauthorizedError, BadRequestError, NotFoundError, AppError } from '../utils/custom-errors';
import { UserPayload } from '../types';
import { logger } from '../config/logger';

export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: RefreshTokenRepository,
    private logRepo: ActivityLogRepository
  ) {}

  private generateAccessToken(user: { id: string; email: string; name: string; role: string }): string {
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as any });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as any });
  }

  async register(input: RegisterInput) {
    const existingUser = await this.userRepo.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.userRepo.create({
      email: input.email,
      name: input.name,
      password: hashedPassword,
      role: 'USER', // Default role
    });

    await this.logRepo.create(user.id, 'USER_REGISTER', `Registered account for email: ${user.email}`);
    logger.info(`User registered successfully: ${user.email}`);

    // Generate tokens automatically upon registration
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);
    
    // Save refresh token to DB
    const decoded = jwt.decode(refreshToken) as { exp: number };
    await this.tokenRepo.create(user.id, refreshToken, new Date(decoded.exp * 1000));

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput) {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    // Save refresh token
    const decoded = jwt.decode(refreshToken) as { exp: number };
    await this.tokenRepo.create(user.id, refreshToken, new Date(decoded.exp * 1000));

    await this.logRepo.create(user.id, 'USER_LOGIN', `Logged in from IP/client`);
    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const savedToken = await this.tokenRepo.findByToken(token);
    if (!savedToken) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Verify token expiry and signature
    try {
      jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch {
      // Token is invalid/expired. Revoke from DB
      await this.tokenRepo.deleteByToken(token);
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate tokens (issue new Access AND new Refresh Token)
    const user = savedToken.user;
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user.id);

    // Transaction-like token rotation
    await this.tokenRepo.deleteByToken(token);
    const decoded = jwt.decode(newRefreshToken) as { exp: number };
    await this.tokenRepo.create(user.id, newRefreshToken, new Date(decoded.exp * 1000));

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string) {
    const deleted = await this.tokenRepo.deleteByToken(token);
    if (deleted) {
      await this.logRepo.create(deleted.userId, 'USER_LOGOUT', `Logged out and revoked session`);
      logger.info(`User session logged out and token revoked`);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      // Security practice: do not leak if account exists or not.
      // But we will generate and return a mock message.
      // For this project, we return a token in response so the flow can be verified.
      return {
        message: 'If the email exists, a password reset token has been generated.',
        resetToken: null,
      };
    }

    // Generate password reset token containing user's email, valid for 15m
    const resetToken = jwt.sign(
      { email: user.email, type: 'password_reset' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    await this.logRepo.create(user.id, 'PASSWORD_RESET_REQUESTED', `Requested a password reset link`);
    logger.info(`Password reset requested for: ${email}`);

    return {
      message: 'If the email exists, a password reset token has been generated.',
      resetToken, // Returned for testing purposes
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { email: string; type: string };
      
      if (decoded.type !== 'password_reset') {
        throw new BadRequestError('Invalid reset token scope');
      }

      const user = await this.userRepo.findByEmail(decoded.email);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepo.update(user.id, { password: hashedPassword });

      // Revoke all existing sessions for safety after password reset
      await this.tokenRepo.deleteByUserId(user.id);

      await this.logRepo.create(user.id, 'PASSWORD_RESET_COMPLETED', `Reset password using token`);
      logger.info(`Password reset completed for user: ${user.email}`);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new BadRequestError('Reset token has expired');
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new BadRequestError('Invalid reset token');
    }
  }

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(input.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    await this.userRepo.update(userId, { password: hashedPassword });

    // Logout from all other devices after password change
    await this.tokenRepo.deleteByUserId(userId);

    await this.logRepo.create(userId, 'PASSWORD_CHANGED', `Changed password from settings`);
    logger.info(`Password changed for user: ${user.email}`);
  }
}

export const authService = new AuthService(userRepository, refreshTokenRepository, activityLogRepository);
