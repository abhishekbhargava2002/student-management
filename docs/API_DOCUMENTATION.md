# API Documentation

Base URL:

```text
http://localhost:4000/api
```

Protected endpoints require:

```text
Authorization: Bearer <JWT_TOKEN>
```

## 1. Login

### POST `/auth/login`

Request:

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

Response:

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

## 2. Student APIs

### POST `/students`

```json
{
  "first_name": "Amit",
  "last_name": "Verma",
  "email": "amit.verma@example.com",
  "phone": "9988776655",
  "date_of_birth": "2001-04-15",
  "gender": "MALE",
  "address": "Mumbai"
}
```

### GET `/students?page=1&limit=10&search=amit`

Returns paginated students with metadata:

```json
{
  "status": true,
  "message": "Students fetched successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### GET `/students/:id`

Returns student details with assigned courses and marks.

### PUT `/students/:id`

```json
{
  "first_name": "Amit",
  "last_name": "Updated",
  "phone": "9000000000",
  "address": "Pune"
}
```

### DELETE `/students/:id`

Deletes the student. Related course assignments and marks are removed using cascade constraints.

## 3. Course APIs

### POST `/courses`

```json
{
  "course_code": "NODE101",
  "name": "Node.js Backend Development",
  "description": "Express.js APIs with PostgreSQL",
  "credits": 4
}
```

### GET `/courses?page=1&limit=10&search=node`

Returns paginated courses.

### GET `/courses/:id`

Returns course details with assigned students.

### PUT `/courses/:id`

```json
{
  "name": "Advanced Node.js Backend Development",
  "credits": 5,
  "is_active": true
}
```

### DELETE `/courses/:id`

Deletes the course. Related assignments and marks are removed using cascade constraints.

## 4. Course Assignment APIs

### POST `/students/:studentId/courses/:courseId`

Assigns a course to a student. Duplicate assignment is handled using `ON CONFLICT`.

### DELETE `/students/:studentId/courses/:courseId`

Removes a course from a student.

## 5. Marks APIs

Marks are linked to both `students` and `courses`. A course must be assigned to a student before marks can be added.

### GET `/students/:studentId/marks`

Returns all marks for one student.

### GET `/students/:studentId/marks/:markId`

Returns one marks record for one student.

### POST `/students/:studentId/marks`

Creates a new marks record. Duplicate `student_id + course_id + exam_name` returns conflict.

```json
{
  "course_id": 1,
  "exam_name": "Final Exam",
  "marks_obtained": 88,
  "max_marks": 100,
  "exam_date": "2026-06-20"
}
```

### PUT `/students/:studentId/marks/:markId`

Updates an existing marks record.

```json
{
  "course_id": 1,
  "exam_name": "Final Exam",
  "marks_obtained": 91,
  "max_marks": 100,
  "exam_date": "2026-06-22"
}
```

### DELETE `/students/:studentId/marks/:markId`

Deletes one marks record.

## Error Response Format

```json
{
  "status": false,
  "message": "Validation failed",
  "details": ["email must be a valid email"]
}
```
