const { success } = require('../helper/response.helper');
const { requireFields, validateId } = require('../utils/validation');
const marksService = require('../services/marks.service');

function validateMarksPayload(body, { partial = false } = {}) {
  if (!partial) requireFields(body, ['course_id', 'exam_name', 'marks_obtained']);

  if (Object.prototype.hasOwnProperty.call(body, 'course_id')) {
    body.course_id = validateId(body.course_id, 'course id');
  }

  if (Object.prototype.hasOwnProperty.call(body, 'exam_name')) {
    if (!body.exam_name || !String(body.exam_name).trim()) {
      return { status: false, message: 'exam_name is required' };
    }
    if (String(body.exam_name).trim().length > 120) {
      return { status: false, message: 'exam_name must be 120 characters or less' };
    }
    body.exam_name = String(body.exam_name).trim();
  }

  if (Object.prototype.hasOwnProperty.call(body, 'marks_obtained')) {
    const marksObtained = Number(body.marks_obtained);
    if (Number.isNaN(marksObtained) || marksObtained < 0) {
      return { status: false, message: 'marks_obtained must be a valid positive number' };
    }
    body.marks_obtained = marksObtained;
  }

  if (Object.prototype.hasOwnProperty.call(body, 'max_marks')) {
    const maxMarks = Number(body.max_marks || 100);
    if (Number.isNaN(maxMarks) || maxMarks <= 0) {
      return { status: false, message: 'max_marks must be greater than 0' };
    }
    body.max_marks = maxMarks;
  } else if (!partial) {
    body.max_marks = 100;
  }

  const marksObtained = Object.prototype.hasOwnProperty.call(body, 'marks_obtained') ? Number(body.marks_obtained) : null;
  const maxMarks = Object.prototype.hasOwnProperty.call(body, 'max_marks') ? Number(body.max_marks) : null;
  if (marksObtained !== null && maxMarks !== null && marksObtained > maxMarks) {
    return { status: false, message: 'marks_obtained must not exceed max_marks' };
  }

  if (Object.prototype.hasOwnProperty.call(body, 'exam_date') && body.exam_date) {
    const date = new Date(body.exam_date);
    if (Number.isNaN(date.getTime())) {
      return { status: false, message: 'exam_date must be a valid date' };
    }
  }

  return null;
}

async function listMarks(req, res) {
  const studentId = validateId(req.params.studentId, 'student id');
  const marks = await marksService.listMarks(studentId);
  return success(res, 'Marks fetched successfully', marks);
}

async function getMarkById(req, res) {
  const studentId = validateId(req.params.studentId, 'student id');
  const markId = validateId(req.params.markId, 'marks id');
  const marks = await marksService.getMarkById(studentId, markId);
  return success(res, 'Marks details fetched successfully', marks);
}

async function createMark(req, res) {
  const studentId = validateId(req.params.studentId, 'student id');
  const validationError = validateMarksPayload(req.body);
  if (validationError) return res.status(400).json(validationError);

  const marks = await marksService.createMark(studentId, req.body);
  return success(res, 'Marks created successfully', marks, 201);
}

async function updateMark(req, res) {
  const studentId = validateId(req.params.studentId, 'student id');
  const markId = validateId(req.params.markId, 'marks id');
  const validationError = validateMarksPayload(req.body, { partial: true });
  if (validationError) return res.status(400).json(validationError);

  const marks = await marksService.updateMark(studentId, markId, req.body);
  return success(res, 'Marks updated successfully', marks);
}

async function deleteMark(req, res) {
  const studentId = validateId(req.params.studentId, 'student id');
  const markId = validateId(req.params.markId, 'marks id');

  await marksService.deleteMark(studentId, markId);
  return success(res, 'Marks deleted successfully');
}

module.exports = { listMarks, getMarkById, createMark, updateMark, deleteMark };
