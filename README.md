# Chobo Server 🚗

> A driving practice tracking service for novice drivers - Junction X Seoul 2021 Hackathon Project

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## 🎯 Overview

**Chobo** (초보 in Korean, meaning "beginner") is a service designed to help novice drivers safely improve their driving skills. It tracks driving practice sessions, provides recommended practice courses, and helps manage vehicle maintenance.

### 🎥 Demo Video

Watch the demo video to see Chobo in action: [YouTube Demo](https://www.youtube.com/watch?v=nff55AmObs8)

### Key Features

- **User Management**: Novice driver profile management
- **Driving Record Tracking**: Detailed records and statistics per practice session
- **Vehicle Management**: Multiple vehicle registration and maintenance interval tracking
- **Practice Course Recommendations**: Beginner-friendly courses via TMap API integration
- **Real-time Tracking**: Location and driving data monitoring during practice

## 🛠 Tech Stack

### Core Technologies

- **Runtime**: Node.js (v14+)
- **Language**: TypeScript 4.2
- **Framework**: Express.js 4.17
- **Database**: MySQL 5.7+
- **Query Builder**: Knex.js

### Development Tools

- **Build Tool**: Babel 7
- **Process Manager**: Nodemon
- **Linting**: ESLint with Airbnb config
- **Testing**: Jest

### Infrastructure

- **Cloud Provider**: AWS
- **CI/CD**: AWS CodePipeline (CodeCommit → CodeBuild → Elastic Beanstalk)
- **Monitoring**: AWS CloudWatch
- **Notifications**: AWS Lambda + Slack integration

## 🏗 Architecture

Chobo follows a **3-Layer Architecture** pattern:

```
┌─────────────────────────────────────────┐
│         Controller Layer                │
│    (HTTP Request/Response Handling)     │
├─────────────────────────────────────────┤
│          Service Layer                  │
│      (Business Logic & Rules)           │
├─────────────────────────────────────────┤
│        Repository Layer                 │
│      (Data Access & Queries)            │
└─────────────────────────────────────────┘
                    │
                    ▼
              ┌─────────┐
              │  MySQL  │
              └─────────┘
```

### Design Principles

- **Dependency Injection**: For improved testability and loose coupling
- **Domain-Driven Design**: Clear domain models and business logic separation
- **Centralized Error Handling**: Consistent error management with custom error types
- **Type Safety**: Full TypeScript implementation for better developer experience

## 🚀 Getting Started

### Prerequisites

#### For Docker Development (Recommended)
- Docker Desktop
- Docker Compose
- Git

#### For Local Development
- Node.js (v18.0.0 or higher)
- npm or yarn
- MySQL 5.7 or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Junction-X-Seoul.git
cd Junction-X-Seoul
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install
```

3. Set up the database:
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE chobo_db;"

# Run migrations (if available)
npm run migrate
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=chobo_db

# TMap API Configuration
TMAP_API_KEY=your_tmap_api_key
TMAP_API_URL=https://apis.openapi.sk.com/tmap

# JWT Configuration (if applicable)
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=24h

# AWS Configuration (for deployment)
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Running the Application

#### Using Docker Compose (Recommended) 🐳

##### Quick Start with Make
```bash
# Start development environment
make dev

# Or start in background
make up

# View logs
make logs

# Stop services
make down
```

##### Manual Docker Commands
```bash
# Development mode with hot-reload
docker-compose -f docker-compose.dev.yml up

# Production mode
docker-compose up -d

# View logs
docker-compose logs -f

# Access database UI (Adminer)
# Open http://localhost:8080
# Server: mysql
# Username: chobo_user
# Password: chobo_password
# Database: chobo_db

# Stop all services
docker-compose down

# Clean everything (including database)
docker-compose down -v
```

#### Development Mode (without Docker)
```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials

# Run in watch mode with auto-reload
npm run dev
```

#### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📚 API Documentation

Complete API documentation is available at:
- **Postman Documentation**: https://documenter.getpostman.com/view/12371867/TzXtK16Q

### Main API Endpoints

#### User Management
- `GET /api/users/:userId` - Get user information
- `POST /api/users` - Create new user
- `PUT /api/users/:userId` - Update user information

#### Driving Records
- `GET /api/records/user/:userId` - Get all driving records for a user
- `POST /api/records` - Create new driving record
- `GET /api/records/:recordId` - Get specific driving record

#### Vehicle Management
- `GET /api/cars/user/:userId` - Get all cars for a user
- `POST /api/cars` - Add new car
- `PUT /api/cars/:carId` - Update car information

#### TMap Integration
- `POST /api/tmap/route` - Get route recommendations
- `GET /api/tmap/practical-courses` - Get practical driving courses for beginners

## 📁 Project Structure

```
Junction-X-Seoul/
├── src/
│   ├── app.ts                 # Application entry point
│   ├── DrivingRecord/         # Driving record module
│   │   ├── DrivingRecordController.ts
│   │   ├── DrivingRecordRepository.ts
│   │   ├── DrivingRecordMapper.ts
│   │   ├── domain/
│   │   │   └── DrivingRecord.ts
│   │   └── service/
│   │       ├── GetPracticalCourse.ts
│   │       ├── GetRecordsByUserId.ts
│   │       └── InsertDrivingRecord.ts
│   ├── user/                  # User module
│   │   ├── UserController.ts
│   │   ├── UserRepository.ts
│   │   ├── domain/
│   │   │   └── User.ts
│   │   ├── service/
│   │   │   └── GetUserByUserId.ts
│   │   └── error/
│   │       └── UserNotExistError.ts
│   ├── car/                   # Car module
│   │   ├── CarRepository.ts
│   │   ├── CarMapper.ts
│   │   ├── domain/
│   │   │   ├── Car.ts
│   │   │   └── ChangeInterval.ts
│   │   └── service/
│   │       └── GetCarsByUserId.ts
│   ├── TMap/                  # TMap integration module
│   │   ├── Tmap.ts
│   │   └── TmapController.ts
│   └── infra/                 # Infrastructure layer
│       ├── ApplicationConfig.ts
│       ├── knexFile.ts
│       ├── QueryExecutor.ts
│       ├── ResponseResult.ts
│       ├── StatusCode.ts
│       ├── header.ts
│       └── errors/
│           ├── CustomError.ts
│           ├── InternalServerError.ts
│           └── PayloadValidationError.ts
├── package.json
├── tsconfig.json
├── babel.config.js
├── build.js
└── README.md
```

## 🚢 Deployment

The application uses AWS services for automated deployment:

### Deployment Pipeline

1. **Code Push**: Push changes to GitHub repository
2. **AWS CodeCommit**: Detects changes and triggers build
3. **AWS CodeBuild**: 
   - Pulls source from GitHub
   - Runs build scripts
   - Creates deployment artifacts
4. **AWS Elastic Beanstalk**: 
   - Receives artifacts
   - Deploys to Auto Scaling Group
5. **Monitoring & Alerts**:
   - CloudWatch monitors deployment status
   - Lambda function sends Slack notifications

### Manual Deployment

For manual deployment to AWS:

```bash
# Build the application
npm run build

# Deploy using AWS CLI or Elastic Beanstalk CLI
eb deploy
```

## 🏆 Acknowledgments

- **Event**: Junction X Seoul 2021
- **Team**: Korea France Collab
- **Client Application**: [iOS App Repository](https://github.com/florianldt/JunctionXSeoul2021)

---

Made with ❤️ during Junction X Seoul 2021