DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS student_courses CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  course_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  credits INT NOT NULL DEFAULT 0 CHECK (credits >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE student_courses (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'DROPPED')),
  UNIQUE (student_id, course_id)
);

CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  exam_name VARCHAR(120) NOT NULL,
  marks_obtained NUMERIC(6,2) NOT NULL CHECK (marks_obtained >= 0),
  max_marks NUMERIC(6,2) NOT NULL DEFAULT 100 CHECK (max_marks > 0),
  exam_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (marks_obtained <= max_marks),
  UNIQUE (student_id, course_id, exam_name),
  CONSTRAINT fk_marks_assigned_course
    FOREIGN KEY (student_id, course_id)
    REFERENCES student_courses(student_id, course_id)
    ON DELETE CASCADE
);

CREATE INDEX idx_students_name ON students(first_name, last_name);
CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_student_courses_student_id ON student_courses(student_id);
CREATE INDEX idx_student_courses_course_id ON student_courses(course_id);
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_course_id ON marks(course_id);


INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@example.com',
  'machine-test-seed-salt:9f24b35713b35f4c97e7bd24536048a9af45544915691248db1cf63fac8959bfa003ac8c44ab9a7e1c5893b07a120810e5d1d86e3c369799c776dbf0aa23597f',
  'ADMIN'
);

INSERT INTO courses (course_code, name, description, credits) VALUES
('JS101', 'JavaScript Basics', 'Fundamentals of JavaScript and browser programming', 3),
('DB101', 'PostgreSQL Basics', 'Relational database concepts and SQL queries', 4),
('REACT101', 'React.js Fundamentals', 'React components, state and frontend integration', 3);

INSERT INTO students (first_name, last_name, email, phone, date_of_birth, gender, address) VALUES
('Rahul', 'Sharma', 'rahul.sharma@example.com', '9876543210', '2003-05-12', 'MALE', 'Pune'),
('Priya', 'Patil', 'priya.patil@example.com', '9876501234', '2002-09-20', 'FEMALE', 'Nagpur');

INSERT INTO student_courses (student_id, course_id)
SELECT s.id, c.id FROM students s CROSS JOIN courses c
WHERE s.email = 'rahul.sharma@example.com' AND c.course_code IN ('JS101', 'DB101');

INSERT INTO marks (student_id, course_id, exam_name, marks_obtained, max_marks, exam_date)
SELECT s.id, c.id, 'Mid Term', 82, 100, '2026-06-01'
FROM students s JOIN courses c ON c.course_code = 'JS101'
WHERE s.email = 'rahul.sharma@example.com';
