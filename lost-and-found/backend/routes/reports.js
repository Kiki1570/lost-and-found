const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createReport, getReports, updateReport } = require('../controllers/reportController');

router.post('/', protect, createReport);
router.get('/', protect, authorize('admin', 'moderator'), getReports);
router.patch('/:id', protect, authorize('admin', 'moderator'), updateReport);

module.exports = router;
