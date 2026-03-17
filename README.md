# Travel Data Collection Platform (SIH 2025)

A comprehensive full-stack solution for collecting, analyzing, and visualizing travel data. This project was originally designed as a mobile-first application using React Native (Expo) and a robust Node.js/Express backend. It is now being migrated to a Next.js web application for broader accessibility.

## 🚀 Features

- **Trip Tracking**: Capture detailed location points, speed, and heading.
- **Mode Prediction**: Automatically predict travel modes (Walking, Cycling, Driving, Public Transport) using velocity data.
- **Interactive Analytics**: Detailed statistics and history of user trips.
- **Secure Authentication**: JWT-based auth with bcrypt password hashing.
- **Robust Backend**: 
  - RESTful API built with Express.js.
  - MongoDB integration for persistent data storage.
  - Redis integration for high-performance caching.
  - Rate limiting, security headers (Helmet), and data compression.

## 🛠️ Tech Stack

### Frontend (Original)
- React Native / Expo
- React Redux (State Management)
- React Native Paper (UI Components)

### Frontend (Migrating to)
- **Next.js** (React)
- Tailwind CSS (Styling)
- Lucide React (Icons)

### Backend
- Node.js & Express
- MongoDB (Mongoose ODM)
- Redis (Caching)
- Joi (Validation)

## 📁 Project Structure

- `/src` - Frontend source code (Components, Screens, Redux).
- `/routes` - API route definitions.
- `/models` - Mongoose schemas (User, Trip).
- `/middleware` - Custom Express middleware (Auth, Validation).
- `/services` - Business logic and specialized services.
- `/config` - Database and API configurations.

## 🌐 Deployment Plan

- **Frontend**: Shifting to Next.js, suitable for deployment on **Vercel**.
- **Backend**: Express server with MongoDB and Redis.
  - **Option A (Render)**: Ideal for the full Express server + Redis management.
  - **Option B (Vercel)**: Possible using Serverless Functions, but requires external Redis (e.g., Upstash).
