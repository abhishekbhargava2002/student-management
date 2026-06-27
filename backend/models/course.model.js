const db = require('../config/db');

const COURSE_COLUMNS = ['course_code', 'name', 'description', 'credits', 'is_active'];

async function create(payload) {
  const result = await db.query(
    `INSERT INTO courses (course_code, name, description, credits, is_active)
     VALUES ($1, $2, $3, COALESCE($4, 0), COALESCE($5, true))
     RETURNING *`,
    [
      payload.course_code,
      payload.name,
      payload.description || null,
      payload.credits || null,
      payload.is_active,
    ]
  );
  return result.rows[0];
}

async function count({ search }) {
  const searchText = search ? `%${search.trim()}%` : null;
  const result = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM courses
     WHERE ($1::text IS NULL OR course_code ILIKE $1 OR name ILIKE $1)`,
    [searchText]
  );
  return result.rows[0].total;
}

async function findAll({ limit, offset, search }) {
  const searchText = search ? `%${search.trim()}%` : null;
  const result = await db.query(
    `SELECT c.*, COUNT(sc.student_id)::int AS assigned_students_count
     FROM courses c
     LEFT JOIN student_courses sc ON sc.course_id = c.id AND sc.status = 'ACTIVE'
     WHERE ($1::text IS NULL OR c.course_code ILIKE $1 OR c.name ILIKE $1)
     GROUP BY c.id
     ORDER BY c.id DESC
     LIMIT $2 OFFSET $3`,
    [searchText, limit, offset]
  );
  return result.rows;
}

async function findById(id) {
  const result = await db.query('SELECT * FROM courses WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function findAssignedStudents(courseId) {
  const result = await db.query(
    `SELECT s.id, s.first_name, s.last_name, s.email, s.phone, sc.assigned_at, sc.status
     FROM student_courses sc
     JOIN students s ON s.id = sc.student_id
     WHERE sc.course_id = $1
     ORDER BY sc.assigned_at DESC`,
    [courseId]
  );
  return result.rows;
}

async function update(id, payload) {
  const setParts = [];
  const values = [];

  COURSE_COLUMNS.forEach((column) => {
    if (Object.prototype.hasOwnProperty.call(payload, column)) {
      values.push(payload[column] === '' ? null : payload[column]);
      setParts.push(`${column} = $${values.length}`);
    }
  });

  if (!setParts.length) return null;

  values.push(id);
  const result = await db.query(
    `UPDATE courses
     SET ${setParts.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await db.query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

module.exports = {
  create,
  count,
  findAll,
  findById,
  findAssignedStudents,
  update,
  remove,
};
