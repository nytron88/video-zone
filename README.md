# Video Zone

## 📺 Overview

Video Zone is a full-stack video-sharing platform that allows users to upload, share, and interact with videos. Users can create accounts, comment on videos, and manage their playlists. The application is built using the **MERN** stack, featuring a robust backend and a dynamic frontend.

## 🚀 Features

### **🔹 Full-Stack Development with Custom Backend**

- Built using the **MERN stack** with a fully custom backend.
- Backend optimized with **MongoDB aggregation pipelines** for handling complex data operations efficiently.

### **📊 Advanced Database Querying**

- Leveraged **MongoDB aggregation pipelines** for tasks such as:
  - Fetching video details
  - Managing comment lists
  - Tracking user watch history
- Demonstrates **proficiency in MongoDB** and optimized database structuring.

### **☁️ Efficient Cloud Uploads**

- Implemented **signed URL uploads** via **Cloudinary**, ensuring efficient file handling without overloading the backend.

### **🛡️ Secure Authentication**

- Utilized **JWT (JSON Web Token)** for secure, stateless authentication.

### **🎥 Video Management**

- Users can **upload, publish, update, and delete** videos.
- Videos are **streamed seamlessly**, ensuring smooth playback.

### **💬 Commenting System**

- Users can **comment** on videos for increased engagement.

### **📂 Playlist Management**

- Users can **create and manage playlists** to organize their favorite videos.

### **🔎 Advanced Search Functionality**

- Utilized **MongoDB Atlas Search** to index and query videos efficiently.
- Supports **debounced and throttled searches** for a smooth UX.

### **📱 Responsive Design**

- Designed with **Tailwind CSS**, ensuring a modern and responsive UI across desktop & mobile.

### **🌀 Infinite Scrolling**

- Implemented **infinite scrolling** for seamless content browsing.

## 🛠️ Tech Stack

### **Frontend**

- **React** + **Redux Toolkit** (for state management)
- **Tailwind CSS** (for styling)

### **Backend**

- **Node.js** + **Express.js**
- **MongoDB** (with aggregation pipelines & indexing via MongoDB Atlas)
- **Cloudinary** (for secure video uploads)

### **Authentication**

- **JWT Tokens** (for stateless, secure authentication)

### **Hosting**

- **Backend**: Hosted on **Heroku**
- **Frontend**: Hosted on **Vercel**

## 📂 Project Structure

### **Backend Overview**

The backend is structured into multiple modules:

- **Controllers**: Handle user authentication, video management, comments, likes, and playlists.
- **Models**: Define database schemas (Users, Videos, Comments, Playlists).
- **Routes**: API endpoints mapped to controller logic.
- **Middlewares**: Authentication, error handling, and request validation.
- **Utils**: Helper functions for API responses, error handling, and Cloudinary integration.

### **Frontend Overview**

The frontend is structured with reusable **React components** and **Redux slices** for state management:

- **Components**: Authentication forms, video players, dashboards, and more.
- **Pages**: User profiles, playlists, video uploads, and search results.
- **Store**: Manages global state, including authentication, comments, playlists, and video data.

## ⚡ Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-username/video-zone.git
cd video-zone
```

### **2️⃣ Install Dependencies**

#### **Backend**

```sh
cd backend
npm install
```

#### **Frontend**

```sh
cd frontend
npm install
```

### **3️⃣ Environment Variables Configuration**

Create a **.env** file in both the frontend and backend directories with the following variables:

#### **Backend **``** Configuration**

```ini
# Server Configuration
PORT=3000
CORS_ORIGIN=http://localhost:5173  # Adjust frontend URL if needed

# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/dbname

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

#### **Frontend **``** Configuration**

```ini
VITE_SERVER_BASE_URL=http://localhost:3000
```

## 🔧 Running the Application

### **Backend**

```sh
cd backend
npm run dev
```

### **Frontend**

```sh
cd frontend
npm run dev
```

Your app should now be running on:

- **Frontend**: `https://videozone88.vercel.app`
- **Backend**: `https://video-zone-backend-bbdfa2d15eb7.herokuapp.com` (Can't be accessed directly due to CORS restrictions)

## 🎥 Screenshots / Demo

![alt text](demo-1.png)
![alt text](demo-2.png)
![alt text](demo-3.png)
![alt text](demo-4.png)
