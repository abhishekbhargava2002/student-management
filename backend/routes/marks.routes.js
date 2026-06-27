const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const marksController = require('../controllers/marks.controller');

const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(marksController.listMarks));
router.get('/:markId', asyncHandler(marksController.getMarkById));
router.post('/', asyncHandler(marksController.createMark));
router.put('/:markId', asyncHandler(marksController.updateMark));
router.delete('/:markId', asyncHandler(marksController.deleteMark));

module.exports = router;
