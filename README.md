# Guardz User Management System

A full-stack web application for user information submission and management, built with NestJS backend and React frontend.

## 🏗️ Architecture

- **Backend**: NestJS with TypeORM and SQLite
- **Frontend**: React with TypeScript, React Query, and Tailwind CSS
- **Deployment**: Docker containers with docker-compose
- **Testing**: Jest (backend), Playwright (E2E)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- Git

## 💻 Local Development

### Option 1: Development Mode (Recommended for Development)
```bash
# 1. Clone and navigate to project
git clone https://github.com/nimibahar/guardz-user-management.git
cd guardz-user-management

# 2. Install dependencies for both services
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Start development servers
npm run dev

# This starts:
# - Backend: http://localhost:8080 (with hot reload)
# - Frontend: http://localhost:5173 (with hot reload)

# Or run services separately:
npm run dev:backend   # Backend only on :8080
npm run dev:frontend  # Frontend only on :5173
```

### Option 2: Docker Development (Parallel with Local)
```bash
# 1. Clone and navigate to project
git clone https://github.com/nimibahar/guardz-user-management.git
cd guardz-user-management

# 2. Start with docker-compose
docker-compose up -d

# Access the application:
# - Frontend: http://localhost:80 (Docker)
# - Backend API: http://localhost:8080 (Docker)

# Note: If you have docker-compose.override.yml locally:
# - Frontend: http://localhost:3000 (Docker)
# - Backend API: http://localhost:3001 (Docker)
# This allows running both local dev and Docker simultaneously
```

### Running Tests Locally
```bash
# Backend unit tests
cd backend && npm test

# Frontend E2E tests (requires both services running)
cd frontend && npm run test

# Run tests in headed mode (see browser)
cd frontend && npm run test:headed
```

## 📁 Project Structure

```
guardz-user-management/
├── backend/              # NestJS API server
├── frontend/             # React client application  
├── docker-compose.yml    # Production deployment
├── docker-compose.dev.yml # Development configuration (optional)
├── docker-compose.override.yml # Local development overrides (gitignored)
└── deploy.sh             # Automated deployment script
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start both services
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only

# Building & Testing
npm run build           # Build both services
npm run test            # Run all tests
npm run test:e2e        # Run E2E tests

# Docker Management
./docker-scripts.sh build    # Build images
./docker-scripts.sh up       # Start production
./docker-scripts.sh dev      # Start development
./docker-scripts.sh down     # Stop containers
./docker-scripts.sh logs     # View logs
./docker-scripts.sh test     # Test containers

# Deployment
./deploy.sh <private_key> [ip]  # Manual deployment
# Automated deployment via GitHub Actions on PR merge
```

## 🌐 API Endpoints

- `GET /health` - Health check
- `GET /users` - Retrieve all users
- `POST /users` - Create new user

### Example Usage
```bash
# Create user
curl -X POST -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com"}' \
  http://localhost:8080/users

# Get users  
curl http://localhost:8080/users
```

## 🧪 Testing

- **Backend Unit Tests**: Jest
- **E2E Tests**: Playwright
- **API Testing**: Manual via curl commands

```bash
cd backend && npm test           # Backend unit tests
cd frontend && npm run test      # E2E tests
```

## 🐳 Deployment

### Local Docker Deployment
```bash
# Build and start both services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚀 Production Deployment

### GitHub Actions Automated Deployment

The project includes automated deployment via GitHub Actions. When you merge a pull request to the main branch, the application automatically deploys to production.

**How it works:**
- Merge any PR to `main` branch
- GitHub Actions automatically triggers deployment
- Application deploys to production server
- Health checks verify successful deployment

**Security features:**
- Only repository owner can trigger deployments
- SSH keys stored securely in GitHub Secrets
- Automatic verification and cleanup

### Manual Deployment Script

For manual deployments, the project includes a deployment script:

```bash
# Deploy to GCP (or any remote server)
./deploy.sh <path-to-private-key> [ip-address]

# Examples:
./deploy.sh ~/Downloads/id_ed25519                    # Uses default IP
./deploy.sh ~/Downloads/id_ed25519 35.223.194.70      # Custom IP
./deploy.sh ~/.ssh/my_key 10.0.0.1                   # Different server
```

**What the deployment script does:**
1. ✅ Creates optimized application archive (excludes node_modules, tests, etc.)
2. ✅ Transfers code securely to remote server via SCP
3. ✅ Builds and deploys both frontend and backend containers
4. ✅ Configures environment-specific API URLs automatically
5. ✅ Provides deployment status and verification commands

### Manual Deployment Steps

If you prefer to deploy manually:

```bash
# 1. Prepare your server (Ubuntu/Debian)
ssh user@your-server-ip
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
# Log out and back in

# 2. Transfer your code
# On your local machine:
tar --exclude='node_modules' --exclude='dist' -czf app.tar.gz .
scp app.tar.gz user@your-server-ip:~/

# 3. Deploy on server
ssh user@your-server-ip
tar -xzf app.tar.gz
export VITE_API_URL="http://YOUR_SERVER_IP:8080"
docker-compose up -d --build

# 4. Verify deployment
curl http://YOUR_SERVER_IP:8080/health
curl http://YOUR_SERVER_IP:8080/users
curl http://YOUR_SERVER_IP/
```

### Setting Up Automated Deployment

To enable GitHub Actions automated deployment:

1. **Add Repository Secrets** (Settings → Secrets and variables → Actions):
   - `GCP_PRIVATE_KEY`: Your SSH private key content
   - `GCP_HOST`: Your server IP address (optional, defaults to 35.223.194.70)
   - `GCP_USER`: SSH username (optional, defaults to candidate)

2. **Merge any PR to main branch** - deployment happens automatically

3. **Monitor deployment** in the GitHub Actions tab

### Environment Configuration

The application automatically adapts to different environments:

- **Local Development**: Uses `http://localhost:8080` for API calls
- **Production**: Uses `http://YOUR_SERVER_IP:8080` (set via environment)
- **Custom**: Override with `VITE_API_URL` environment variable

### Firewall Configuration

Make sure these ports are open on your server:
- **Port 80**: Frontend (HTTP)
- **Port 8080**: Backend API
- **Port 22**: SSH (for deployment)

```bash
# Example for Ubuntu/GCP
sudo ufw allow 22    # SSH
sudo ufw allow 80    # Frontend
sudo ufw allow 8080  # Backend API
sudo ufw enable
```

## 🛠️ Tech Stack

**Backend:**
- NestJS framework
- TypeORM with SQLite
- Class-validator for validation
- Jest for testing

**Frontend:**
- React 19 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- React Query for data fetching
- React Table for data display
- React Hook Form with Zod validation
- Playwright for E2E testing

**DevOps:**
- Docker & Docker Compose
- Multi-stage builds
- Health checks
- Volume persistence

## 📋 Features

✅ User information submission form  
✅ User data validation (client & server)  
✅ Responsive data table with search/sort  
✅ Real-time data updates  
✅ Error handling & loading states  
✅ Comprehensive testing  
✅ Containerized deployment  
✅ Production-ready configuration  

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature-name`  
5. Submit pull request

## 📝 License

This project is part of the Guardz technical assignment.