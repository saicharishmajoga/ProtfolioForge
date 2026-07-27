# PortfolioForge Backend API

A production-ready, highly modular, and secure REST API backend for the **PortfolioForge** SaaS application built with **Express.js**, **TypeScript**, and **Prisma ORM** with **PostgreSQL**.

PortfolioForge enables users to build professional portfolios, customize themes, publish portfolios, upload and parse resume files (PDF/DOCX) using custom rule-based heuristics, and generate PDF resumes dynamically.

---

## 🛠 Tech Stack
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Authentication**: Stateless JWT Access Token + Rotation-enabled Database Refresh Tokens
- **File Storage**: Abstracted Storage Service (Local Folder upload, pluggable for S3/Cloudinary)
- **Validation**: Zod (Input Schemas)
- **Security**: Helmet, CORS, Express-Rate-Limit, XSS Sanitization, Password Hashing (bcryptjs)
- **Logging**: Winston Logger (Console in dev, JSON Files in production)
- **Documentation**: Swagger UI & OpenAPI 3.0 Specifications
- **Testing**: Jest & Supertest

---

## 📁 Clean Architecture Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (Models, Constraints, Relations, Indexes)
│   └── seed.ts                # Test/seed data setup (Users, Portfolios, Subsections)
├── src/
│   ├── config/                # Environment variables validation, Winston logger, and Swagger specs
│   ├── controllers/           # HTTP Request layer handlers (Zod validation, Response sending)
│   ├── services/              # Core business logic (Storage, Resume parsing, PDF resume generation)
│   │   ├── storage/           # Storage Interface and Local implementation (extendable to S3)
│   │   ├── parser/            # Resume Document parser pipeline (PDF/DOCX heuristics parser)
│   │   └── resume/            # Resume Generator drawing templates via PDFKit
│   ├── repositories/          # Database encapsulation layer (User, Portfolio, RefreshToken repositories)
│   ├── routes/                # Express routes mapping (Auth, Portfolio, Files, Dashboard, Resumes)
│   ├── middleware/            # JWT validation, Role-based auth (RBAC), Upload limits, Sanitization, Error catcher
│   ├── validators/            # Zod validation schemas
│   ├── utils/                 # Response formatters, async wrappers, custom error handlers, slug generators
│   ├── types/                 # Shared TypeScript interfaces (User payload, Parsed resume shapes)
│   ├── app.ts                 # Express application initialization
│   └── server.ts              # Server bootstrapper & DB connection check
├── tests/                     # Jest Unit and Integration tests
├── .env.example               # Environment variables template
├── Dockerfile                 # Multi-stage production build Dockerfile
├── docker-compose.yml         # Container configuration for API and DB
├── package.json               # Scripts and dependency versions
└── tsconfig.json              # TypeScript compilation options
```

### Key Design Patterns Implemented:
1. **SOLID Principles**: Focused interfaces, single responsibility services, and decoupled data models.
2. **Repository Pattern**: Prevents database details from leaking into business logic.
3. **Dependency Injection**: Services and repositories are injected, allowing easy mocking during tests and provider swappings (e.g. swap Local storage to AWS S3 storage without touching controllers).
4. **Centralized Error Boundary**: Custom errors flow up from services and are caught by a global middleware, returning a standardized JSON schema.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: `v20.x` or later (LTS recommended)
- **npm**: `v10.x` or later
- **PostgreSQL**: Local server running or Docker installed

### 2. Installation
Clone the project and navigate into the `backend` folder:
```bash
cd backend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your database credentials:
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` matches your local database setup (e.g. `postgresql://postgres:password@localhost:5432/portfolioforge?schema=public`).

### 4. Database Setup & Seeding
Create migrations and apply the schema to the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run DB Migrations
npm run prisma:migrate

# Seed Database with sample user and portfolio
npm run prisma:seed
```

### 5. Running the Application
Start the server in development mode (with auto-reload):
```bash
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000).

- **API Documentation**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Health Check**: `GET http://localhost:5000/`

---

## 🐳 Containerization with Docker

You can run the API and PostgreSQL databases in isolated Docker containers:

1. **Launch Containers**:
   ```bash
   docker-compose up --build
   ```
2. **Post-launch Migrations**:
   Run migrations and seed files inside the running API container:
   ```bash
   docker-compose exec api npx prisma migrate deploy
   docker-compose exec api npm run prisma:seed
   ```
This automatically sets up a PostgreSQL container (with health checks) and builds the API using a slim Node.js runner image. File uploads are persisted in a Docker volume `uploads_data`.

---

## 🧪 Testing
We use **Jest** and **Supertest** for testing. To run unit and integration tests:
```bash
# Run tests
npm run test

# Run tests with coverage metrics
npm run test:coverage
```

---

## 📌 API Reference Summary

Interactive OpenAPI documentation is available locally at `/api-docs`. Below is a summary of the main endpoints:

### 1. Authentication (`/api/auth`)
- `POST /register`: Create user account & log in.
- `POST /login`: Log in user and retrieve tokens.
- `POST /refresh`: Rotate refresh token and fetch new access token (RTR pattern).
- `POST /logout`: Invalidate refresh token.
- `POST /forgot-password`: Generates reset token (signed JWT, expires in 15m).
- `POST /reset-password`: Resets password using token.
- `POST /change-password` (Auth): Changes password from settings.

### 2. Portfolios & Sections (`/api/portfolios`)
- `GET /`: List paginated portfolios for user.
- `POST /`: Initialize a portfolio with default sections.
- `GET /:id`: Retrieve portfolio details with sections.
- `PUT /:id`: Update portfolio metadata (title, published state).
- `DELETE /:id`: Deletes portfolio (cascade deletes sections).
- `POST /:id/duplicate`: Clones the portfolio and all nested models.
- `GET /public/:slug` (Public): Get a published portfolio by unique slug (increments views).
- `PUT /:portfolioId/theme` (Auth): Update colors, fonts, layout.
- `PUT /:portfolioId/profile` (Auth): Update name, biography, title.
- `PUT /:portfolioId/contact` (Auth): Update location, email, telephone.
- `PUT /:portfolioId/socials` (Auth): Replace platform links.

### 3. Subsection CRUD (`/api/portfolios/:portfolioId/<section>`)
Supports `POST /`, `PUT /:id`, `DELETE /:id` and `PUT /reorder` (drag-and-drop ordering) for the following:
- `/skills`
- `/projects`
- `/experiences`
- `/educations`
- `/certificates`
- `/achievements`

### 4. File Upload & Parsing (`/api/files`)
- `POST /upload/profile` (Auth): Upload image files for avatar, saves to `/uploads/profiles`.
- `POST /upload/project` (Auth): Upload project screenshot, saves to `/uploads/projects`.
- `POST /upload/certificate` (Auth): Upload certificate image, saves to `/uploads/certificates`.
- `POST /upload/resume` (Auth): Upload PDF/DOCX resume file. Saves to local directory, extracts text, runs the heuristics engine, and returns structured JSON fields to auto-fill portfolios.

### 5. PDF Resume Generation (`/api/resumes`)
- `POST /generate` (Auth): Passes `portfolioId` and `templateId` ("classic" or "modern") and streams a professional PDF document back.

### 6. Analytics Dashboard (`/api/dashboard`)
- `GET /`: Get aggregate stats (Drafts/Published counts, Total views), recent portfolio edits, active user logs, and a dynamic profile completion score.
