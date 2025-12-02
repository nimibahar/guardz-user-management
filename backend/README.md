# Backend - NestJS API

Backend service for the Guardz User Management System built with NestJS, TypeORM, and SQLite.

## 🏗️ Architecture

- **Framework**: NestJS
- **Database**: SQLite with TypeORM
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Local Development Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start development server (with hot reload)
npm run start:dev

# Server runs on http://localhost:8080 with auto-restart on file changes
```

### Alternative Development Commands
```bash
# Start without hot reload
npm run start

# Start in debug mode (for debugging with breakpoints)
npm run start:debug

# Build and run production build locally
npm run build
npm run start:prod
```

### Development Features
- 🔥 **Hot Reload**: Automatic restart on file changes
- 🐛 **Debug Mode**: Attach debugger on port 9229
- 📊 **API Documentation**: Swagger available at `/api` (if enabled)
- 🗃️ **Database**: SQLite auto-created in development
- 🔍 **Logging**: Detailed request/response logging

## 📁 Project Structure

```
src/
├── app.module.ts          # Root application module
├── main.ts               # Application entry point
├── app.controller.ts     # Root controller
├── app.service.ts        # Root service
└── users/               # Users feature module
    ├── users.module.ts     # Users module
    ├── users.controller.ts # Users HTTP endpoints
    ├── users.service.ts    # Users business logic
    ├── user.entity.ts      # User database entity
    └── dto/
        └── create-user.dto.ts # Data transfer object
```

## 🌐 API Endpoints

### Health Check
```http
GET /health
Response: {"status": "ok"}
```

### User Management

#### Get All Users
```http
GET /users
Response: User[]
```

#### Create User
```http
POST /users
Content-Type: application/json

{
  "firstName": "string",      # Required
  "lastName": "string",       # Required  
  "email": "string",          # Required, valid email, unique
  "phone": "string",          # Optional, must be unique if provided
  "company": "string"         # Optional
}

Response: User
```

### Error Responses
- `400 Bad Request` - Validation errors
- `409 Conflict` - User registration failed
- `500 Internal Server Error` - Server errors

## 🗃️ Database Schema

### User Entity
```typescript
{
  id: number;              # Auto-generated primary key
  firstName: string;       # User's first name
  lastName: string;        # User's last name
  email: string;          # Unique email address
  phone?: string;         # Optional unique phone number
  company?: string;       # Optional company name
  createdAt: Date;        # Auto-generated timestamp
}
```

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Test Structure
```
test/
├── users.controller.spec.ts  # Controller unit tests
└── users.service.spec.ts     # Service unit tests
```

## ⚙️ Configuration

### Environment Variables
```bash
PORT=8080                    # Server port (default: 8080)
DATABASE_PATH=/tmp/db.sqlite # SQLite database path
NODE_ENV=development         # Environment mode
```

### CORS Configuration
The API allows requests from:
- `http://localhost:3000` (dev)
- `http://localhost:5173` (vite dev)  
- `http://localhost` (production frontend)
- `http://localhost:80` (production frontend)

### Database Configuration
- **Type**: SQLite
- **Path**: Configurable via `DATABASE_PATH` env var
- **Synchronization**: Enabled (auto-creates tables)
- **Entity Discovery**: Automatic

## 🐳 Docker

### Development
```bash
# Build development image
docker build -t guardz-backend --target development .

# Run development container
docker run -p 8080:8080 guardz-backend
```

### Production
```bash
# Build production image
docker build -t guardz-backend --target production .

# Run production container
docker run -p 8080:8080 guardz-backend
```

## 🔧 Available Scripts

```bash
npm run start           # Start application
npm run start:dev       # Start in development mode
npm run start:debug     # Start in debug mode  
npm run start:prod      # Start production build

npm run build          # Build application
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint

npm test               # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:debug     # Run tests in debug mode
npm run test:e2e       # Run end-to-end tests
```

## 📦 Dependencies

### Production Dependencies
- `@nestjs/common` - NestJS common utilities
- `@nestjs/core` - NestJS core framework
- `@nestjs/platform-express` - Express platform adapter
- `@nestjs/typeorm` - TypeORM integration
- `typeorm` - ORM for database operations
- `sqlite3` - SQLite database driver
- `class-validator` - Validation decorators
- `class-transformer` - Object transformation
- `reflect-metadata` - Metadata reflection API
- `rxjs` - Reactive extensions

### Development Dependencies
- `@nestjs/cli` - NestJS CLI tools
- `@nestjs/testing` - Testing utilities
- `typescript` - TypeScript compiler
- `jest` - Testing framework
- `supertest` - HTTP assertion library
- `eslint` - Code linting
- `prettier` - Code formatting

## 🚨 Error Handling

The API implements comprehensive error handling:

- **Validation Errors**: Automatic validation with detailed error messages
- **Database Errors**: Proper error responses for database constraints
- **CORS Errors**: Configured for cross-origin requests
- **Global Exception Filter**: Catches and formats all errors consistently

## 🔒 Security

- **Input Validation**: All endpoints validate input data
- **SQL Injection Protection**: TypeORM provides parameterized queries
- **CORS Configuration**: Restricts cross-origin requests to allowed origins
- **Email/Phone Enumeration Protection**: Generic error messages prevent email and phone number harvesting
- **No Sensitive Data Exposure**: Error responses are carefully crafted to avoid information leakage

## 📊 Performance

- **Database Connection Pooling**: Managed by TypeORM
- **Efficient Queries**: Optimized database queries with proper indexing
- **Minimal Memory Footprint**: SQLite for lightweight data storage
- **Fast Startup**: Optimized for quick container startup times