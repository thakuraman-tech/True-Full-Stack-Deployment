# Team Task Management Web Application

A full-stack, production-ready Team Task Management Web Application built with the MERN stack (MongoDB, Express, React, Node.js) and Vite.

## Features

- **Authentication System**: Secure JWT-based registration and login with bcrypt password hashing.
- **Role-Based Access**:
  - *Admin*: Can create projects, add/remove members, and manage all tasks.
  - *Member*: Can view assigned projects and update task status.
- **Project Management**: Create workspaces, invite team members, and view member roles.
- **Task Board**: Interactive Kanban-style drag-and-drop board for task management using `@dnd-kit`.
- **Real-Time Updates**: Socket.io integration to sync task creation, updates, and deletion across all connected clients instantly.
- **Dashboard Analytics**: Comprehensive insights using Recharts (Pie charts for status, Bar charts for priority).
- **Premium UI/UX**: Modern glassmorphism design, smooth micro-animations, custom scrollbars, and full Dark Mode support via Tailwind CSS v4.
- **Responsive**: Fully responsive sidebar layout optimized for desktop and mobile.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, React Router, Axios, Recharts, Dnd-Kit, Socket.io-client, Lucide React, React Toastify.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io, JSON Web Token (JWT), bcryptjs.

## Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` file exists with:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/team-task-manager
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Railway Deployment Steps

### 1. Database
- Create a MongoDB service on Railway or use MongoDB Atlas.
- Get the Connection URL.

### 2. Backend Deployment
- Create a new service on Railway connected to your GitHub repo.
- Set the root directory to `/server`.
- Add Environment Variables:
  - `MONGO_URI` = [Your MongoDB URL]
  - `JWT_SECRET` = [Your Secret]
  - `PORT` = `5000`

### 3. Frontend Deployment
- Create a new service on Railway connected to your GitHub repo.
- Set the root directory to `/client`.
- Update the `api.js` base URL or configure a rewrite to point to your deployed backend URL.
- Build command: `npm run build`
- Start command: `npm run preview` or use a static host on Railway.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks?projectId=ID` - Get project tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics
