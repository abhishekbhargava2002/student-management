# Student Management System

Full-stack machine-test project using Node.js, Express.js, PostgreSQL, and React.js.

This refactored version keeps the existing functionality and API behavior unchanged while cleaning the backend and frontend architecture.

## Features

- JWT login authentication
- Student CRUD
- Course CRUD
- Course assignment to students
- Marks CRUD
- Student detail with assigned courses and marks
- Student pagination
- Course pagination
- PostgreSQL normalized schema
- React Bootstrap UI
- SweetAlert feedback
- Postman collection

## Final Folder Structure

```text
student-management-machine-test-solution
├── backend
│   ├── config
│   ├── controllers
│   ├── errors
│   ├── helper
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── uploads
│   ├── utils
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── Images
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── constants
│   │   ├── hooks
│   │   ├── pages
│   │   ├── redux
│   │   ├── routes
│   │   └── utils
│   ├── package.json
│   └── README.md
├── database
│   └── schema.sql
├── docs
│   └── API_DOCUMENTATION.md
└── postman
    └── Student-Management-System.postman_collection.json
```

## Database Setup

From project root:

```powershell
createdb -U postgres student_management_db
psql -U postgres -d student_management_db -f database/schema.sql
```

If the database already exists, run only:

```powershell
psql -U postgres -d student_management_db -f database/schema.sql
```

## Backend Setup

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

Backend API base URL:

```text
http://localhost:5000/api
```

Backend `.env`:

```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/student_management_db
JWT_SECRET=student-management-secret
JWT_EXPIRES_IN_SECONDS=86400
```

Update PostgreSQL password in `DATABASE_URL` if needed.

## Frontend Setup

Open a second terminal:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Default Login

```text
Email: admin@example.com
Password: Admin@123
```

## Main API Endpoints

### Auth

```http
POST /api/auth/login
```

### Students

```http
POST   /api/students
GET    /api/students?page=1&limit=10
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id
```

### Courses

```http
POST   /api/courses
GET    /api/courses?page=1&limit=10
GET    /api/courses/:id
PUT    /api/courses/:id
DELETE /api/courses/:id
```

### Course Assignment

```http
POST   /api/students/:studentId/courses/:courseId
DELETE /api/students/:studentId/courses/:courseId
```

### Marks

```http
GET    /api/students/:studentId/marks
GET    /api/students/:studentId/marks/:markId
POST   /api/students/:studentId/marks
PUT    /api/students/:studentId/marks/:markId
DELETE /api/students/:studentId/marks/:markId
```

## Manual Verification Flow

1. Login with default credentials.
2. Create a student.
3. Create a course.
4. Assign the course to the student.
5. Add marks for the assigned course.
6. View student details with marks.
7. Update marks.
8. Delete marks.
9. Verify student pagination.

## Architecture Notes

### Backend

The backend follows this flow:

```text
server.js → app.js → routes → controllers → services → models → PostgreSQL
```

- `server.js` starts the server only.
- `app.js` configures Express, CORS, JSON parsing, routes, 404 handler, and error handler.
- `routes/` defines API paths only.
- `controllers/` handles request validation and response.
- `services/` holds business logic.
- `models/` contains PostgreSQL query methods.
- `middleware/` contains JWT authentication.
- `errors/` contains centralized error handling.
- `helper/` contains response formatting.
- `utils/` contains reusable validation, JWT, password, async, and pagination helpers.

### Frontend

The frontend follows this flow:

```text
main.jsx → App.jsx → routes → pages → components → utils/api.js
```

- `pages/Login.jsx` handles login.
- `pages/Dashboard.jsx` owns page state and feature handlers.
- `components/students/` contains student form/list and course assignment.
- `components/courses/` contains course form/list.
- `components/marks/` contains marks management.
- `utils/api.js` contains fetch wrapper with JWT header.
- `utils/auth.js` contains token helpers.
- `utils/swal.js` contains SweetAlert helpers.
