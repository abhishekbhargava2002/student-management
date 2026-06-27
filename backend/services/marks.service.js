const AppError = require('../errors/AppError');
const marksModel = require('../models/marks.model');
const studentModel = require('../models/student.model');

async function ensureActiveCourseAssignment(studentId, courseId) {
  const assigned = await studentModel.hasActiveCourseAssignment(studentId, courseId);
  if (!assigned) {
    throw new AppError('Assign this course to the student before adding marks', 400);
  }
}

async function listMarks(studentId) {
  return marksModel.findByStudentId(studentId);
}

async function getMarkById(studentId, markId) {
  const marks = await marksModel.findById(studentId, markId);
  if (!marks) throw new AppError('Marks record not found', 404);
  return marks;
}

async function createMark(studentId, payload) {
  await ensureActiveCourseAssignment(studentId, payload.course_id);
  const marks = await marksModel.create(studentId, payload);
  return getMarkById(studentId, marks.id);
}

async function updateMark(studentId, markId, payload) {
  await getMarkById(studentId, markId);

  if (Object.prototype.hasOwnProperty.call(payload, 'course_id')) {
    await ensureActiveCourseAssignment(studentId, payload.course_id);
  }

  const updated = await marksModel.update(studentId, markId, payload);
  if (!updated) throw new AppError('No valid fields provided for update', 400);
  return getMarkById(studentId, markId);
}

async function deleteMark(studentId, markId) {
  const deleted = await marksModel.remove(studentId, markId);
  if (!deleted) throw new AppError('Marks record not found', 404);
  return deleted;
}

module.exports = { listMarks, getMarkById, createMark, updateMark, deleteMark };
