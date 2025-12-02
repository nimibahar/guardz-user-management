#!/bin/bash

# Guardz Application Deployment Script
# Usage: ./deploy.sh <private_key_path> [ip_address]

set -e

# Default values
DEFAULT_IP="35.223.194.70"
DEFAULT_USER="candidate"

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <private_key_path> [ip_address]"
    echo "Example: $0 ~/Downloads/id_ed25519"
    echo "Example: $0 ~/Downloads/id_ed25519 35.223.194.70"
    exit 1
fi

PRIVATE_KEY="$1"
IP_ADDRESS="${2:-$DEFAULT_IP}"
USER="$DEFAULT_USER"

# Check if private key exists
if [ ! -f "$PRIVATE_KEY" ]; then
    echo "❌ Error: Private key file not found: $PRIVATE_KEY"
    exit 1
fi

# Set correct permissions on private key
chmod 600 "$PRIVATE_KEY"

echo "🚀 Starting deployment to $IP_ADDRESS..."
echo "📁 Using private key: $PRIVATE_KEY"

# Create archive excluding unnecessary files
echo "📦 Creating application archive..."
tar --exclude='node_modules' \
    --exclude='dist' \
    --exclude='test-results' \
    --exclude='playwright-report' \
    --exclude='database.sqlite' \
    --exclude='*.tar.gz' \
    --exclude='backend/test' \
    --exclude='frontend/tests' \
    --exclude='docker-compose.override.yml' \
    -czf ../grdz-deployment.tar.gz .

# Transfer files
echo "📤 Transferring files to GCP instance..."
scp -i "$PRIVATE_KEY" ../grdz-deployment.tar.gz $USER@$IP_ADDRESS:~/

# Deploy on remote server
echo "🔧 Deploying application on remote server..."
ssh -i "$PRIVATE_KEY" $USER@$IP_ADDRESS << ENDSSH
    # Stop existing containers
    echo "⏹️  Stopping existing containers..."
    docker-compose down 2>/dev/null || true

    # Clean up old files
    echo "🧹 Cleaning up old deployment..."
    rm -rf backend frontend *.yml *.sh package.json README.md 2>/dev/null || true

    # Extract new files
    echo "📂 Extracting new application files..."
    tar -xzf grdz-deployment.tar.gz
    rm grdz-deployment.tar.gz

    # Set environment variable for API URL (optional override)
    export VITE_API_URL="http://${IP_ADDRESS}:8080"
    
    # Build and start services
    echo "🏗️  Building and starting services with API_URL=\$VITE_API_URL..."
    docker-compose up -d --build

    # Wait for services to be ready
    echo "⏳ Waiting for services to start..."
    sleep 10

    # Check service status
    echo "✅ Checking service status..."
    docker-compose ps

    echo ""
    echo "🎉 Deployment complete!"
    echo "Frontend: http://$HOSTNAME"
    echo "Backend:  http://$HOSTNAME:8080"
ENDSSH

# Clean up local archive
rm -f ../grdz-deployment.tar.gz

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Frontend: http://$IP_ADDRESS"
echo "📡 Backend:  http://$IP_ADDRESS:8080"
echo ""
echo "💡 To verify deployment:"
echo "   curl http://$IP_ADDRESS:8080/health"
echo "   curl http://$IP_ADDRESS:8080/users"