# Backend Architecture

Node.js + Express.js + PostgreSQL backend for Student Management System.

## Structure

```text
backend
├── config/db.js
├── controllers
├── errors
├── helper
├── middleware
├── models
├── routes
├── services
├── uploads
├── utils
├── app.js
└── server.js
```

## Flow

```text
server.js → app.js → routes → controllers → services → models → PostgreSQL
```

## Run

```powershell
copy .env.example .env
npm install
npm run dev
```

## Environment

```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/student_management_db
JWT_SECRET=student-management-secret
JWT_EXPIRES_IN_SECONDS=86400
```

## Notes

- `server.js` only starts the server.
- `app.js` only configures Express and mounts routes.
- Routes only define endpoint paths.
- Controllers validate input and call services.
- Services handle business logic.
- Models contain PostgreSQL query functions.
- JWT middleware protects student and course APIs.
