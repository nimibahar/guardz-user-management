# Backend Dockerfile for NestJS API
# Multi-stage build for optimal image size and security

# ===========================================
# Development Stage - For local development
# ===========================================
FROM node:18-alpine AS development
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package*.json ./
RUN npm ci --include=dev

# Copy source code and start development server
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start:dev"]

# ===========================================
# Build Stage - Compile TypeScript to JavaScript
# ===========================================
FROM node:18-alpine AS build
WORKDIR /usr/src/app

# Install ALL dependencies (including devDependencies for building)
COPY package*.json ./
RUN npm ci

# Copy source code and compile TypeScript
COPY . .
RUN npm run build

# ===========================================
# Production Stage - Minimal runtime image
# ===========================================
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# Install curl for health checks (lightweight alpine package)
RUN apk add --no-cache curl

# Security: Create non-root user to run the application
# This follows Docker security best practices
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Install ONLY production dependencies (no devDependencies)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled application from build stage
COPY --from=build /usr/src/app/dist ./dist

# Create data directory and set permissions for database
RUN mkdir -p data && chown -R nestjs:nodejs data

# Security: Switch to non-root user
# This prevents potential privilege escalation attacks
USER nestjs

# Document the port the application uses
EXPOSE 8080

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Health check to ensure container is ready and healthy
# Docker will automatically restart unhealthy containers
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start the compiled Node.js application
# Handle both possible build structures: dist/main.js or dist/src/main.js
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; else node dist/src/main.js; fi"]