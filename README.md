# Look-in

Look-in is a web-based attendance management system for organizations that want to track employee presence digitally with location-based check-in, attendance history, permits, notifications, and face verification support.

## What this project is for

This project helps companies or teams manage daily attendance in a modern and more reliable way. Instead of relying only on manual attendance sheets, Look-in allows users to:

- check in and check out through a web app
- verify attendance using face recognition
- use GPS-based attendance settings to confirm the user is in the right location
- submit and manage leave or permit requests
- view attendance records and notifications
- manage users, datasets, and attendance settings from an admin dashboard

## Main features

- Role-based access for hiring managers, employees, and interns
- Admin dashboard for managing users, attendance records, permits, and settings
- Public dashboard for employees to track their attendance and permits
- Attendance check-in and check-out workflow with optional face verification
- Permit request and approval flow
- Notification system for important updates

## Tech stack

- Backend: NestJS + Bun + Sequelize + MySQL
- Frontend: Vue 3 + Vite + TypeScript
- AI/face verification: Python-based model under the model folder

## Project structure

- backend: NestJS API server
- frontend: Vue web application
- model: face recognition model and related files

## Requirements

Before running the project, make sure you have:

- Node.js and npm
- Bun
- MySQL database
- Python 3 (for the face recognition model support)

## Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd look-in
```

2. Install backend dependencies

```bash
cd backend
bun install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Prepare the environment

Create a .env file inside the backend folder and configure at least the following values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=look_in
SECRET_KEY=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

5. Create the database and run migrations

```bash
cd backend
bun run migrate
bun run seed
```

## Running the project

### Start the backend

```bash
cd backend
bun run start:dev
```

The API will run on http://localhost:3000

### Start the frontend

```bash
cd frontend
npm run dev
```

The web app will run on http://localhost:5173

## Optional: run with Docker

If you prefer Docker, you can run the backend container from the backend folder:

```bash
cd backend
docker compose up --build
```

## Default access

After the app is running, open the frontend in your browser and log in or register an account. The system is designed for different roles such as hiring manager and employee.
