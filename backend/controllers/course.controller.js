const { success } = require('../helper/response.helper');
const { requireFields, validateId } = require('../utils/validation');
const { getPagination } = require('../utils/pagination');
const courseService = require('../services/course.service');

async function createCourse(req, res) {
  requireFields(req.body, ['course_code', 'name']);

  const course = await courseService.createCourse(req.body);
  return success(res, 'Course created successfully', course, 201);
}

async function listCourses(req, res) {
  const pagination = getPagination(req.query);
  const result = await courseService.listCourses({ ...pagination, search: req.query.search || null });
  return success(res, 'Courses fetched successfully', result.rows, 200, result.meta);
}

async function getCourseById(req, res) {
  const id = validateId(req.params.id, 'course id');
  const course = await courseService.getCourseById(id);
  return success(res, 'Course details fetched successfully', course);
}

async function updateCourse(req, res) {
  const id = validateId(req.params.id, 'course id');
  const course = await courseService.updateCourse(id, req.body);
  return success(res, 'Course updated successfully', course);
}

async function deleteCourse(req, res) {
  const id = validateId(req.params.id, 'course id');
  await courseService.deleteCourse(id);
  return success(res, 'Course deleted successfully');
}

module.exports = { createCourse, listCourses, getCourseById, updateCourse, deleteCourse };
