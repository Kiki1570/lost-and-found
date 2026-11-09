const express = require('express');
const Item = require('../models/Item');
const protect = require('../middleware/auth');

const router = express.Router();

// Show all items. You can filter with ?type=lost or ?type=found.
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type && ['lost', 'found'].includes(req.query.type)) {
      filter.type = req.query.type;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const items = await Item.find(filter).populate('owner', 'name').sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load items.' });
  }
});

// Add a lost or found item. Login is required.
router.post('/', protect, async (req, res) => {
  try {
    const { type, title, category, description, location, contact, date } = req.body;

    if (!type || !title || !category || !description || !location || !contact || !date) {
      return res.status(400).json({ success: false, message: 'Please complete all fields.' });
    }

    const item = await Item.create({
      type, title, category, description, location, contact, date, owner: req.user._id
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not add item.' });
  }
});

// Delete your own post.
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Post not found or you do not own it.' });
    }

    res.json({ success: true, message: 'Post deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not delete post.' });
  }
});

module.exports = router;
