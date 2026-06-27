const AppError = require('../errors/AppError');
const studentModel = require('../models/student.model');
const marksModel = require('../models/marks.model');

async function createStudent(payload) {
  return studentModel.create(payload);
}

async function listStudents({ page, limit, offset, search }) {
  const [total, rows] = await Promise.all([
    studentModel.count({ search }),
    studentModel.findAll({ limit, offset, search }),
  ]);

  return {
    rows,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getStudentById(id) {
  const student = await studentModel.findById(id);
  if (!student) throw new AppError('Student not found', 404);

  const [courses, marks] = await Promise.all([
    studentModel.findAssignedCourses(id),
    marksModel.findByStudentId(id),
  ]);

  return { ...student, courses, marks };
}

async function updateStudent(id, payload) {
  const student = await studentModel.update(id, payload);
  if (!student) {
    const existing = await studentModel.findById(id);
    if (!existing) throw new AppError('Student not found', 404);
    throw new AppError('No valid fields provided for update', 400);
  }
  return student;
}

async function deleteStudent(id) {
  const student = await studentModel.remove(id);
  if (!student) throw new AppError('Student not found', 404);
  return student;
}

async function assignCourse(studentId, courseId) {
  return studentModel.assignCourse(studentId, courseId);
}

async function removeCourse(studentId, courseId) {
  const assignment = await studentModel.removeCourse(studentId, courseId);
  if (!assignment) throw new AppError('Course assignment not found', 404);
  return assignment;
}

module.exports = {
  createStudent,
  listStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  assignCourse,
  removeCourse,
};
