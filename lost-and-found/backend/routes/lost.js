const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getLostItems, getLostItem, createLostItem, updateLostItem,
  deleteLostItem, getMyLostItems, markAsFound
} = require('../controllers/lostController');

router.get('/', getLostItems);
router.get('/my-items', protect, getMyLostItems);
router.get('/:id', getLostItem);
router.post('/', protect, upload.array('images', 5), createLostItem);
router.put('/:id', protect, updateLostItem);
router.delete('/:id', protect, deleteLostItem);
router.patch('/:id/found', protect, markAsFound);

module.exports = router;
