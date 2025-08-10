## Index

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
   - [Backend Overview](#backend-overview)
   - [Advanced MongoDB Schema](#advanced-mongodb-schema)
   - [Database Schema Diagram](#database-schema-diagram)
5. [Installation & Setup](#installation--setup)
6. [Docker Setup](#docker-setup)
7. [Running the Application](#running-the-application)
8. [Screenshots / Demo](#screenshots--demo)

## <a id="overview"></a>Overview

Video Zone is a full-stack video-sharing platform that allows users to upload, share, and interact with videos. Users can create accounts, comment on videos, and manage their playlists. The application is built using the **MERN** stack, featuring a robust backend and a dynamic frontend.

## <a id="features"></a>Features

### Full-Stack Development with Custom Backend

- Built using the **MERN stack** with a fully custom backend.
- Backend optimized with **MongoDB aggregation pipelines** for handling complex data operations efficiently.

### Advanced Database Querying

- Leveraged **MongoDB aggregation pipelines** for tasks such as:
  - Fetching video details
  - Managing comment lists
  - Tracking user watch history
- Demonstrates **proficiency in MongoDB** and optimized database structuring.

### Efficient Cloud Uploads

- Implemented **signed URL uploads** via **Cloudinary**, ensuring efficient file handling without overloading the backend.

### Secure Authentication

- Utilized **JWT (JSON Web Token)** for secure, stateless authentication.

### Video Management

- Users can **upload, publish, update, and delete** videos.
- Videos are **streamed seamlessly**, ensuring smooth playback.

### Commenting System

- Users can **comment** on videos for increased engagement.

### Playlist Management

- Users can **create and manage playlists** to organize their favorite videos.

### Advanced Search Functionality

- Utilized **MongoDB Atlas Search** to index and query videos efficiently.
- Supports **debounced and throttled searches** for a smooth UX.

### Responsive Design

- Designed with **Tailwind CSS**, ensuring a modern and responsive UI across desktop & mobile.

### Infinite Scrolling

- Implemented **infinite scrolling** for seamless content browsing.

## <a id="tech-stack"></a>Tech Stack

### Frontend

- **React** + **Redux Toolkit** (for state management)
- **Tailwind CSS** (for styling)

### Backend

- **Node.js** + **Express.js**
- **MongoDB** (with aggregation pipelines & indexing via MongoDB Atlas)
- **Cloudinary** (for secure video uploads)

### Authentication

- **JWT Tokens** (for stateless, secure authentication)

### Containerization

- **Docker** + **Docker Compose** (for easy development and deployment)
- **Nginx** (serving static frontend assets in production container)

### Hosting

- **Infrastructure**: AWS VPC with public and private subnets across multiple availability zones
- **Backend**: Deployed in private subnet with NAT Gateway for internet connectivity
- **Reverse Proxy**: Hardened Nginx server in public subnet routing traffic to backend
- **Frontend**: Static assets served via S3 and CloudFront CDN
- **Security**: Header-based API authentication with CORS protection and rate limiting via Nginx
- **Frontend URL**: https://d32ufchmjrnj28.cloudfront.net

## <a id="project-structure"></a>Project Structure

### <a id="backend-overview"></a>Backend Overview

The backend is structured into multiple modules:

- **Controllers**: Handle user authentication, video management, comments, likes, and playlists.
- **Models**: Define database schemas (Users, Videos, Comments, Playlists).
- **Routes**: API endpoints mapped to controller logic.
- **Middlewares**: Authentication, error handling, and request validation.
- **Utils**: Helper functions for API responses, error handling, and Cloudinary integration.

### <a id="advanced-mongodb-schema"></a>Advanced MongoDB Schema: High-Complexity NoSQL Data Model

The database is designed for **scalability and efficiency**, utilizing **MongoDB with optimized relationships** between collections. The schema includes:

- **Users**: Authentication and profile management
- **Videos**: Video storage with metadata
- **Comments & Likes**: Engagement tracking
- **Playlists**: Personalized video collections
- **Watch History**: Tracks user video interactions
- **Subscriptions**: User-to-user follow system

This schema ensures **high-performance querying**, leveraging **aggregation pipelines, indexing, and denormalized references** where necessary.

### <a id="database-schema-diagram"></a>Database Schema Diagram

The following **ERD (Entity-Relationship Diagram)** visually represents the relationships between collections in the MongoDB database:

![VideoZone Database Schema](diagram.png)

## <a id="installation--setup"></a>Installation & Setup

### Clone the Repository

```sh
git clone https://github.com/your-username/video-zone.git
cd video-zone
```

### Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd frontend
npm install
```

### Environment Variables Configuration

Create a **.env** file in the backend directory with the following variables:

#### Backend Configuration (.env)

```ini
# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:3000  # Frontend URL for Docker setup

# MongoDB Connection (for Docker with local MongoDB)
MONGODB_URI=mongodb://db:27017
# OR for external MongoDB Atlas
# MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/dbname

# JWT Authentication
ACCESS_TOKEN_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Docker Environment Variables

For the frontend Docker build, create a **.env** file in the root directory:

```ini
# Frontend build configuration
VITE_SERVER_BASE_URL=http://localhost:8000
```

## <a id="docker-setup"></a>Docker Setup

### Prerequisites

- **Docker** and **Docker Compose** installed on your system
- For Docker Compose setup, you can use the included local MongoDB container or connect to MongoDB Atlas

### Docker Architecture

The application uses a multi-container setup:
- **Frontend**: React app served via Nginx (Port 3000)
- **Backend**: Node.js/Express API (Port 8000) 
- **Database**: MongoDB container (Port 27017)

### Running with Docker Compose

1. **Configure Environment Variables**: Create the necessary `.env` files as described in the [Environment Variables Configuration](#environment-variables-configuration) section.

2. **Build and Run All Services**:
   ```sh
   docker-compose up --build
   ```

3. **Run in Detached Mode** (optional):
   ```sh
   docker-compose up -d --build
   ```

4. **Stop All Services**:
   ```sh
   docker-compose down
   ```

5. **Remove Volumes** (to reset database):
   ```sh
   docker-compose down -v
   ```

### Individual Container Management

#### Build Individual Services:
```sh
# Build frontend only
docker-compose build frontend

# Build backend only  
docker-compose build backend
```

#### View Logs:
```sh
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

## <a id="running-the-application"></a>Running the Application

### Option 1: Docker Compose (Recommended)

```sh
docker-compose up --build
```

Your app will be running on:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8000`
- **MongoDB**: `localhost:27017`

### Option 2: Traditional Development Setup

#### Backend

```sh
cd backend
npm run dev
```

#### Frontend

```sh
cd frontend
npm run dev
```

Your app will be running on:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000` (or your configured PORT)

### Production Deployment

The application is also deployed in production with:
- **Frontend**: `https://d32ufchmjrnj28.cloudfront.net`
- **Backend**: Deployed in private subnet, accessible via Nginx reverse proxy (not directly accessible for security)

## <a id="screenshots--demo"></a>Screenshots / Demo

![Demo 1](demo-1.png)
![Demo 2](demo-2.png)
