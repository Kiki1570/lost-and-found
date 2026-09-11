const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getFoundItems, getFoundItem, createFoundItem, updateFoundItem,
  deleteFoundItem, getMyFoundItems, claimFoundItem
} = require('../controllers/foundController');

router.get('/', getFoundItems);
router.get('/my-items', protect, getMyFoundItems);
router.get('/:id', getFoundItem);
router.post('/', protect, upload.array('images', 5), createFoundItem);
router.put('/:id', protect, updateFoundItem);
router.delete('/:id', protect, deleteFoundItem);
router.patch('/:id/claim', protect, claimFoundItem);

module.exports = router;
