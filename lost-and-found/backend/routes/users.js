const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile, updateProfile, getAllUsers, toggleBan, deleteAccount, getAdminStats
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.delete('/me', protect, deleteAccount);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.patch('/:id/ban', protect, authorize('admin'), toggleBan);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);

module.exports = router;
