const AppError = require('../errors/AppError');
const courseModel = require('../models/course.model');

async function createCourse(payload) {
  return courseModel.create(payload);
}

async function listCourses({ page, limit, offset, search }) {
  const [total, rows] = await Promise.all([
    courseModel.count({ search }),
    courseModel.findAll({ limit, offset, search }),
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

async function getCourseById(id) {
  const course = await courseModel.findById(id);
  if (!course) throw new AppError('Course not found', 404);

  const students = await courseModel.findAssignedStudents(id);
  return { ...course, students };
}

async function updateCourse(id, payload) {
  const course = await courseModel.update(id, payload);
  if (!course) {
    const existing = await courseModel.findById(id);
    if (!existing) throw new AppError('Course not found', 404);
    throw new AppError('No valid fields provided for update', 400);
  }
  return course;
}

async function deleteCourse(id) {
  const course = await courseModel.remove(id);
  if (!course) throw new AppError('Course not found', 404);
  return course;
}

module.exports = { createCourse, listCourses, getCourseById, updateCourse, deleteCourse };
