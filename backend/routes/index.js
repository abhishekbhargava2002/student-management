const express = require('express');
const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const courseRoutes = require('./course.routes');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/students', authenticate, studentRoutes);
router.use('/courses', authenticate, courseRoutes);

module.exports = router;
