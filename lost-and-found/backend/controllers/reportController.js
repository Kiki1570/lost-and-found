const Report = require('../models/Report');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// @desc    Create report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    const { itemType, itemId, reason, description } = req.body;

    const itemModel = itemType === 'lost' ? 'LostItem' : 'FoundItem';
    const Model = itemType === 'lost' ? LostItem : FoundItem;

    const item = await Model.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    // Prevent duplicate reports
    const existing = await Report.findOne({ reporter: req.user.id, itemId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reported this item.' });
    }

    const report = await Report.create({
      reporter: req.user.id,
      itemType,
      itemId,
      itemModel,
      reason,
      description
    });

    res.status(201).json({ success: true, message: 'Report submitted. Our team will review it.', report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reports (admin)
// @route   GET /api/reports
// @access  Admin
exports.getReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, reports });
  } catch (err) {
    next(err);
  }
};

// @desc    Update report status (admin)
// @route   PATCH /api/reports/:id
// @access  Admin
exports.updateReport = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, reviewedBy: req.user.id, reviewedAt: new Date() },
      { new: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
};
