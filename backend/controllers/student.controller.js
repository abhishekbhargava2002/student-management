const { success } = require('../helper/response.helper');
const { requireFields, validateEmail, validateId } = require('../utils/validation');
const { getPagination } = require('../utils/pagination');
const studentService = require('../services/student.service');

async function createStudent(req, res) {
  requireFields(req.body, ['first_name', 'last_name', 'email']);
  validateEmail(req.body.email);

  const student = await studentService.createStudent(req.body);
  return success(res, 'Student created successfully', student, 201);
}

async function listStudents(req, res) {
  const pagination = getPagination(req.query);
  const result = await studentService.listStudents({ ...pagination, search: req.query.search || null });
  return success(res, 'Students fetched successfully', result.rows, 200, result.meta);
}

async function getStudentById(req, res) {
  const id = validateId(req.params.id, 'student id');
  const student = await studentService.getStudentById(id);
  return success(res, 'Student details fetched successfully', student);
}

async function updateStudent(req, res) {
  const id = validateId(req.params.id, 'student id');
  if (req.body.email) validateEmail(req.body.email);

  const student = await studentService.updateStudent(id, req.body);
  return success(res, 'Student updated successfully', student);
}

async function deleteStudent(req, res) {
  const id = validateId(req.params.id, 'student id');
  await studentService.deleteStudent(id);
  return success(res, 'Student deleted successfully');
}

async function assignCourse(req, res) {
  const studentId = validateId(req.params.studentId, 'student id');
  const courseId = validateId(req.params.courseId, 'course id');

  const assignment = await studentService.assignCourse(studentId, courseId);
  return success(res, 'Course assigned to student successfully', assignment, 201);
}

async function removeCourse(req, res) {
  const studentId = validateId(req.params.studentId, 'student id');
  const courseId = validateId(req.params.courseId, 'course id');

  await studentService.removeCourse(studentId, courseId);
  return success(res, 'Course removed from student successfully');
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
