const db = require('../config/db');

const STUDENT_COLUMNS = [
  'first_name',
  'last_name',
  'email',
  'phone',
  'date_of_birth',
  'gender',
  'address',
  'status',
];

async function create(payload) {
  const result = await db.query(
    `INSERT INTO students
      (first_name, last_name, email, phone, date_of_birth, gender, address, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'ACTIVE'))
     RETURNING *`,
    [
      payload.first_name,
      payload.last_name,
      payload.email,
      payload.phone || null,
      payload.date_of_birth || null,
      payload.gender || null,
      payload.address || null,
      payload.status || null,
    ]
  );

  return result.rows[0];
}

async function count({ search }) {
  const searchText = search ? `%${search.trim()}%` : null;
  const result = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM students
     WHERE ($1::text IS NULL OR first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1)`,
    [searchText]
  );
  return result.rows[0].total;
}

async function findAll({ limit, offset, search }) {
  const searchText = search ? `%${search.trim()}%` : null;
  const result = await db.query(
    `SELECT s.*, COUNT(sc.course_id)::int AS assigned_courses_count
     FROM students s
     LEFT JOIN student_courses sc ON sc.student_id = s.id AND sc.status = 'ACTIVE'
     WHERE ($1::text IS NULL OR s.first_name ILIKE $1 OR s.last_name ILIKE $1 OR s.email ILIKE $1 OR s.phone ILIKE $1)
     GROUP BY s.id
     ORDER BY s.id DESC
     LIMIT $2 OFFSET $3`,
    [searchText, limit, offset]
  );
  return result.rows;
}

async function findById(id) {
  const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function findAssignedCourses(studentId) {
  const result = await db.query(
    `SELECT c.id, c.course_code, c.name, c.description, c.credits, sc.assigned_at, sc.status
     FROM student_courses sc
     JOIN courses c ON c.id = sc.course_id
     WHERE sc.student_id = $1
     ORDER BY sc.assigned_at DESC`,
    [studentId]
  );
  return result.rows;
}

async function update(id, payload) {
  const setParts = [];
  const values = [];

  STUDENT_COLUMNS.forEach((column) => {
    if (Object.prototype.hasOwnProperty.call(payload, column)) {
      values.push(payload[column] === '' ? null : payload[column]);
      setParts.push(`${column} = $${values.length}`);
    }
  });

  if (!setParts.length) return null;

  values.push(id);
  const result = await db.query(
    `UPDATE students
     SET ${setParts.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

async function assignCourse(studentId, courseId) {
  const result = await db.query(
    `INSERT INTO student_courses (student_id, course_id, status)
     VALUES ($1, $2, 'ACTIVE')
     ON CONFLICT (student_id, course_id)
     DO UPDATE SET status = 'ACTIVE', assigned_at = NOW()
     RETURNING *`,
    [studentId, courseId]
  );
  return result.rows[0];
}

async function removeCourse(studentId, courseId) {
  const result = await db.query(
    `DELETE FROM student_courses
     WHERE student_id = $1 AND course_id = $2
     RETURNING *`,
    [studentId, courseId]
  );
  return result.rows[0] || null;
}

async function hasActiveCourseAssignment(studentId, courseId) {
  const result = await db.query(
    `SELECT 1
     FROM student_courses
     WHERE student_id = $1 AND course_id = $2 AND status = 'ACTIVE'`,
    [studentId, courseId]
  );
  return Boolean(result.rows[0]);
}

module.exports = {
  create,
  count,
  findAll,
  findById,
  findAssignedCourses,
  update,
  remove,
  assignCourse,
  removeCourse,
  hasActiveCourseAssignment,
};
