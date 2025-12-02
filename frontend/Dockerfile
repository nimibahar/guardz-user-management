# Frontend Dockerfile for React/Vite application
# Multi-stage build for development, building, and production

# ===========================================
# Base Stage - Common dependencies
# ===========================================
FROM node:18-alpine AS base
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
# Install dependencies (includes both prod and dev for building)
RUN npm ci && npm cache clean --force

# ===========================================
# Development Stage - For local development with hot reload
# ===========================================
FROM base AS development
# Copy source code
COPY . .

# Set API URL for development (connects to local backend)
ENV VITE_API_URL=http://localhost:8080

# Expose Vite dev server port
EXPOSE 5173

# Start Vite development server with host binding for Docker access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ===========================================
# Build Stage - Compile React/TypeScript for production
# ===========================================
FROM base AS build
# Copy source code
COPY . .

# Accept API URL as build argument (set during deployment)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the React application for production
RUN npm run build

# ===========================================
# Production Stage - Serve static files with Nginx
# ===========================================
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React application to Nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx runs as root by default in the official image - this is acceptable for this use case
# The container itself provides isolation

# Document the port Nginx serves on
EXPOSE 80

# Health check to ensure Nginx is serving content
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start Nginx in foreground mode (required for Docker containers)
CMD ["nginx", "-g", "daemon off;"]