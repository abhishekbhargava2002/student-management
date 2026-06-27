const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const courseController = require('../controllers/course.controller');

const router = express.Router();

router.post('/', asyncHandler(courseController.createCourse));
router.get('/', asyncHandler(courseController.listCourses));
router.get('/:id', asyncHandler(courseController.getCourseById));
router.put('/:id', asyncHandler(courseController.updateCourse));
router.delete('/:id', asyncHandler(courseController.deleteCourse));

module.exports = router;
