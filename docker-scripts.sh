#!/bin/bash

# Docker management scripts for Guardz assignment

case "$1" in
    "build")
        echo "Building Docker images..."
        docker-compose build
        ;;
    "up")
        echo "Starting containers..."
        docker-compose up -d
        ;;
    "down")
        echo "Stopping containers..."
        docker-compose down
        ;;
    "logs")
        echo "Showing container logs..."
        docker-compose logs -f
        ;;
    "clean")
        echo "Cleaning up containers and volumes..."
        docker-compose down -v
        docker system prune -f
        ;;
    "test")
        echo "Testing containerized application..."
        echo "Backend health: $(curl -s http://localhost:8080/health || echo 'FAILED')"
        echo "Frontend health: $(curl -s http://localhost/health || echo 'FAILED')"
        ;;
    *)
        echo "Usage: $0 {build|up|down|logs|clean|test}"
        echo "  build  - Build Docker images"
        echo "  up     - Start containers"
        echo "  down   - Stop all containers"
        echo "  logs   - Show container logs"
        echo "  clean  - Clean up containers and volumes"
        echo "  test   - Test if containers are working"
        exit 1
        ;;
esac