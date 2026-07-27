import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PortfolioForge REST API',
      version: '1.0.0',
      description: 'Production-ready REST API for the PortfolioForge SaaS platform supporting developer portfolio creation, resume parsing, and resume PDF generation.',
      contact: {
        name: 'PortfolioForge Support',
        email: 'support@portfolioforge.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT Access Token (Bearer <token>) to access protected endpoints.',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed or Unauthorized access' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email address' },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            profileImage: { type: 'string', nullable: true },
            role: { type: 'string', example: 'USER' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Portfolio: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            slug: { type: 'string' },
            published: { type: 'boolean' },
            views: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user account',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    password: { type: 'string', format: 'password', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'User registered successfully' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          accessToken: { type: 'string' },
                          refreshToken: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            409: { description: 'Email is already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            422: { description: 'Input validation failed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Log in with existing credentials',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    password: { type: 'string', format: 'password', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Logged in successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'User logged in successfully' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          accessToken: { type: 'string' },
                          refreshToken: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Invalid email or password' },
          },
        },
      },
      '/api/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Renew access token using refresh token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Tokens rotated successfully' },
            401: { description: 'Invalid or expired refresh token' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Log out user and revoke refresh token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Logged out successfully' },
          },
        },
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Request a password reset token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Instructions and token generated successfully' },
          },
        },
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Reset password using the generated token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'newPassword'],
                  properties: {
                    token: { type: 'string', example: 'jwt-reset-token-here' },
                    newPassword: { type: 'string', minLength: 6, example: 'newpassword123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Password reset completed successfully' },
            400: { description: 'Invalid or expired reset token' },
          },
        },
      },
      '/api/portfolios': {
        get: {
          tags: ['Portfolios'],
          summary: "Fetch logged-in user's portfolios (paginated)",
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: { description: 'Portfolios fetched successfully' },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Portfolios'],
          summary: 'Create a new portfolio with default sections',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', example: 'My Web Dev Portfolio' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Portfolio created successfully' },
          },
        },
      },
      '/api/portfolios/{id}': {
        get: {
          tags: ['Portfolios'],
          summary: 'Get details of a portfolio including all subsections',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Portfolio fetched successfully' },
            404: { description: 'Portfolio not found' },
          },
        },
        put: {
          tags: ['Portfolios'],
          summary: 'Update portfolio root metadata (title, publish state)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    published: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Portfolio updated successfully' },
          },
        },
        delete: {
          tags: ['Portfolios'],
          summary: 'Delete portfolio and all its sections (cascade)',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Portfolio deleted successfully' },
          },
        },
      },
      '/api/portfolios/{id}/duplicate': {
        post: {
          tags: ['Portfolios'],
          summary: 'Duplicate an entire portfolio structure including sections and sub-items',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            201: { description: 'Portfolio duplicated successfully' },
          },
        },
      },
      '/api/portfolios/public/{slug}': {
        get: {
          tags: ['Portfolios'],
          summary: 'Retrieve a published portfolio by its unique slug (publicly accessible)',
          security: [],
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string', example: 'john-doe' } }],
          responses: {
            200: { description: 'Portfolio details fetched successfully' },
            404: { description: 'Portfolio not found or is private' },
          },
        },
      },
      '/api/dashboard': {
        get: {
          tags: ['Dashboard'],
          summary: 'Retrieve user stats, recent activity, and latest portfolio completion level',
          responses: {
            200: { description: 'Dashboard metrics fetched' },
          },
        },
      },
      '/api/resumes/generate': {
        post: {
          tags: ['Resume'],
          summary: 'Generate and stream a professional PDF resume using portfolio data',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['portfolioId'],
                  properties: {
                    portfolioId: { type: 'string', format: 'uuid' },
                    templateId: { type: 'string', enum: ['classic', 'modern'], default: 'classic' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Streams PDF binary data response back' },
          },
        },
      },
      '/api/files/upload/resume': {
        post: {
          tags: ['File Upload / Parsing'],
          summary: 'Upload resume document (PDF/DOCX), save it, and return parsed structured JSON fields',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['file'],
                  properties: {
                    file: { type: 'string', format: 'binary', description: 'Resume file (PDF or DOCX)' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Resume parsed and uploaded successfully' },
          },
        },
      },
    },
  },
  apis: [], // Empty since we defined all paths statically above
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
