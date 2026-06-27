const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const studentController = require('../controllers/student.controller');
const marksRoutes = require('./marks.routes');

const router = express.Router();

router.post('/', asyncHandler(studentController.createStudent));
router.get('/', asyncHandler(studentController.listStudents));
router.get('/:id', asyncHandler(studentController.getStudentById));
router.put('/:id', asyncHandler(studentController.updateStudent));
router.delete('/:id', asyncHandler(studentController.deleteStudent));

router.post('/:studentId/courses/:courseId', asyncHandler(studentController.assignCourse));
router.delete('/:studentId/courses/:courseId', asyncHandler(studentController.removeCourse));

router.use('/:studentId/marks', marksRoutes);

module.exports = router;
