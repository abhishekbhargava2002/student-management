const db = require('../config/db');

const MARK_COLUMNS = ['course_id', 'exam_name', 'marks_obtained', 'max_marks', 'exam_date'];

async function findByStudentId(studentId) {
  const result = await db.query(
    `SELECT m.id,
            m.student_id,
            m.course_id,
            c.course_code,
            c.name AS course_name,
            m.exam_name,
            m.marks_obtained,
            m.max_marks,
            ROUND((m.marks_obtained / NULLIF(m.max_marks, 0)) * 100, 2) AS percentage,
            m.exam_date,
            m.created_at,
            m.updated_at
     FROM marks m
     JOIN courses c ON c.id = m.course_id
     WHERE m.student_id = $1
     ORDER BY m.exam_date DESC NULLS LAST, m.id DESC`,
    [studentId]
  );
  return result.rows;
}

async function findById(studentId, markId) {
  const result = await db.query(
    `SELECT m.id,
            m.student_id,
            m.course_id,
            c.course_code,
            c.name AS course_name,
            m.exam_name,
            m.marks_obtained,
            m.max_marks,
            ROUND((m.marks_obtained / NULLIF(m.max_marks, 0)) * 100, 2) AS percentage,
            m.exam_date,
            m.created_at,
            m.updated_at
     FROM marks m
     JOIN courses c ON c.id = m.course_id
     WHERE m.student_id = $1 AND m.id = $2`,
    [studentId, markId]
  );
  return result.rows[0] || null;
}

async function create(studentId, payload) {
  const result = await db.query(
    `INSERT INTO marks (student_id, course_id, exam_name, marks_obtained, max_marks, exam_date)
     VALUES ($1, $2, $3, $4, COALESCE($5, 100), $6)
     RETURNING *`,
    [
      studentId,
      payload.course_id,
      payload.exam_name.trim(),
      payload.marks_obtained,
      payload.max_marks || null,
      payload.exam_date || null,
    ]
  );
  return result.rows[0];
}

async function update(studentId, markId, payload) {
  const setParts = [];
  const values = [];

  MARK_COLUMNS.forEach((column) => {
    if (Object.prototype.hasOwnProperty.call(payload, column)) {
      const value = column === 'exam_name' && payload[column] ? payload[column].trim() : payload[column];
      values.push(value === '' ? null : value);
      setParts.push(`${column} = $${values.length}`);
    }
  });

  if (!setParts.length) return null;

  values.push(studentId, markId);
  const result = await db.query(
    `UPDATE marks
     SET ${setParts.join(', ')}, updated_at = NOW()
     WHERE student_id = $${values.length - 1} AND id = $${values.length}
     RETURNING id`,
    values
  );

  return result.rows[0] || null;
}

async function remove(studentId, markId) {
  const result = await db.query(
    `DELETE FROM marks
     WHERE student_id = $1 AND id = $2
     RETURNING id`,
    [studentId, markId]
  );
  return result.rows[0] || null;
}

module.exports = {
  findByStudentId,
  findById,
  create,
  update,
  remove,
};
