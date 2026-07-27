# ==========================================
# Stage 1: Build Environment
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install package dependencies
COPY package*.json ./
RUN npm ci

# Copy database schema and generate client before compiler runs
COPY prisma ./prisma
RUN npx prisma generate

# Copy source and configurations
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# ==========================================
# Stage 2: Runtime Environment
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built package and production node_modules
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create local storage folders for file uploads
RUN mkdir -p uploads/profiles uploads/projects uploads/certificates uploads/resumes

# Expose the API port
EXPOSE 5000

# Run database migrations and start the application server
CMD ["node", "dist/server.js"]
