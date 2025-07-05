.PHONY: help dev prod up down logs shell db-shell test lint build clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev       - Start development environment with hot-reload"
	@echo "  make prod      - Start production environment"
	@echo "  make up        - Start services in background"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View application logs"
	@echo "  make shell     - Access app container shell"
	@echo "  make db-shell  - Access MySQL shell"
	@echo "  make test      - Run tests"
	@echo "  make lint      - Run linter"
	@echo "  make build     - Build TypeScript"
	@echo "  make clean     - Remove containers and volumes"

# Development environment with hot-reload
dev:
	docker-compose -f docker-compose.dev.yml up

# Production environment
prod:
	docker-compose up

# Start services in background
up:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Services started! Access the app at http://localhost:3000"
	@echo "Adminer (Database UI) available at http://localhost:8080"

# Stop all services
down:
	docker-compose -f docker-compose.dev.yml down

# View logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f app-dev

# Access app container shell
shell:
	docker-compose -f docker-compose.dev.yml exec app-dev sh

# Access MySQL shell
db-shell:
	docker-compose -f docker-compose.dev.yml exec mysql mysql -u chobo_user -pchobo_password chobo_db

# Run tests
test:
	npm test

# Run linter
lint:
	npm run lint

# Build TypeScript
build:
	npm run build

# Clean up everything
clean:
	docker-compose -f docker-compose.dev.yml down -v
	rm -rf node_modules dist coverage