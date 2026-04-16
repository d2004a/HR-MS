# HR Management System

A comprehensive Full-Stack HR Management System built with the MERN stack (MongoDB, Express, React, Node.js) + Vite and Tailwind CSS. The application features a **Premium Light-Mode custom-themed UI** designed for a modern, professional experience.

## Project Overview

**Employee Features:**
- Secure authentication (JWT) with persistent sessions
- **Modern Dashboard** with Leave Balance, Today's Attendance status, and Recent Activity
- Mark Daily Attendance with intuitive visual feedback
- Apply for Leave with automatic duration and balance management
- Registration Welcome Emails (Simulated via console)
- Detailed Leave and Attendance history views

**Admin Features:**
- High-level Dashboard with real-time analytics
- Comprehensive Leave Management (Review, Approve, Reject)
- Global Attendance Monitoring with date-based filtering
- Complete Employee Directory Management

## Premium UI & Design

The application has been overhauled with a modern aesthetic:
- **Light Theme:** Transitioned from a dark theme to a clean, professional "Slate & White" palette.
- **Rich Visuals:** Uses high-quality abstract backgrounds on authentication pages for a premium portal feel.
- **Glassmorphism:** Subtle glass-style cards and smooth transitions across all dashboards.
- **Interactive Elements:** Enhanced feedback on buttons, inputs, and state badges.

## Tech Stack

- **Frontend:** React 18 + Vite (Fast compilation & HMR)
- **Styling:** Tailwind CSS v3 (Utility-first approach for custom design systems)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JSON Web Tokens (Stateless JWT)
- **Email Service:** Custom simulated service for notifications.

## Installation Steps

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Access at: `http://localhost:5173`

## Environment Variables

### Backend (`backend/.env`)
- `PORT` - 5000 (default)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Your secret key

### Frontend (`frontend/.env`)
- `VITE_API_URL` - `http://localhost:5000/api`

## Admin Credentials
Seeded automatically on first run:
- **Email:** `admin@hrms.com`
- **Password:** `admin123`

## Database Models
- **User:** `fullName`, `email`, `password`, `role`, `dateOfJoining`, `leaveBalance` (default 20).
- **Leave:** `employee`, `leaveType`, `startDate`, `endDate`, `totalDays`, `reason`, `status`.
- **Attendance:** `employee`, `date`, `status` (present/absent). Unique index prevents duplicate entries.

## Core Features

- **Premium UI & Design:** A complete visual overhaul featuring a modern light theme, abstract backgrounds on auth pages, and glassmorphism.
- **Role-Based Access:** Dedicated interfaces for Employees and Administrators.
- **Attendance Tracking:** Simple, one-click daily attendance marking with duplicate prevention.
- **Leave Management:** Robust system for applying, reviewing, and tracking leave requests.
- **Email Notifications (Simulated):** 
    - Automatically triggers a professional welcome email simulation upon new user registration.
    - Logs detailed email data (Subject, To, Content) to the backend terminal for verification.

## AI Tools & Development

### Tools Used
- ChatGPT – Used for project ideation, planning workflow, and understanding best practices during development.
- Antigravity – Used for enhancing UI/UX design and performing application-level testing.
- Manual Development Tools – React, Node.js, Express, MongoDB (used to build the full-stack application and implement core features).

### AI Contributions (Why & Where AI Was Used)
AI tools were used primarily as guidance and productivity enhancers, not for direct code generation:

Assisted in project planning and structuring, including how to start the project and define development phases.
Provided suggestions for improving UI/UX, which were later refined using Antigravity.
Helped with approach-level guidance for features like:
Seeding admin credentials manually
Structuring role-based access (Admin vs Employee)
Supported debugging strategies and optimization ideas, but final implementation was written manually.
Used Antigravity for UI/UX improvements and testing insights to refine the user experience.
Used chat gpt for deep debugging for my cors related issues and deployment issues


## Manual Implementation & Business Logic
-The core logic and implementation of the project were independently designed and developed:

-Designed and implemented the complete UI from scratch without direct AI-generated code.
-Developed all functional features manually, including:
    Authentication flow
    Role-based access control (Admin & Employee separation)
-Implemented custom business logic for leave management, including:
    Leave calculation rules
    Validation and approval workflows
-Built backend APIs and handled data flow, state management, and database integration manually.
-Structured the application architecture and ensured end-to-end functionality without relying on AI-generated code.

## Testing
```bash
cd backend
npm test
```
