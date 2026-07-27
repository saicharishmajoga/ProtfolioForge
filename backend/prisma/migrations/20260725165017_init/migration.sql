-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileImage" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "accentColor" TEXT NOT NULL DEFAULT '#10B981',
    "font" TEXT NOT NULL DEFAULT 'Inter',
    "layout" TEXT NOT NULL DEFAULT 'classic',
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "animations" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Theme_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfileSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    CONSTRAINT "ProfileSection_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AboutSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "subHeading" TEXT,
    CONSTRAINT "AboutSection_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "location" TEXT,
    CONSTRAINT "ContactSection_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "SocialLink_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "experienceLevel" TEXT,
    "years" REAL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Skill_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Project_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Experience_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "cgpa" REAL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Education_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "date" DATETIME,
    "credentialUrl" TEXT,
    "imageUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Certificate_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Achievement_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_slug_key" ON "Portfolio"("slug");

-- CreateIndex
CREATE INDEX "Portfolio_userId_idx" ON "Portfolio"("userId");

-- CreateIndex
CREATE INDEX "Portfolio_slug_idx" ON "Portfolio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_portfolioId_key" ON "Theme"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileSection_portfolioId_key" ON "ProfileSection"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutSection_portfolioId_key" ON "AboutSection"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactSection_portfolioId_key" ON "ContactSection"("portfolioId");

-- CreateIndex
CREATE INDEX "SocialLink_portfolioId_idx" ON "SocialLink"("portfolioId");

-- CreateIndex
CREATE INDEX "Skill_portfolioId_idx" ON "Skill"("portfolioId");

-- CreateIndex
CREATE INDEX "Project_portfolioId_idx" ON "Project"("portfolioId");

-- CreateIndex
CREATE INDEX "Experience_portfolioId_idx" ON "Experience"("portfolioId");

-- CreateIndex
CREATE INDEX "Education_portfolioId_idx" ON "Education"("portfolioId");

-- CreateIndex
CREATE INDEX "Certificate_portfolioId_idx" ON "Certificate"("portfolioId");

-- CreateIndex
CREATE INDEX "Achievement_portfolioId_idx" ON "Achievement"("portfolioId");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");
