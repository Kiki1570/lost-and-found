const User = require('../models/User');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const lostCount = await LostItem.countDocuments({ user: req.user.id });
    const foundCount = await FoundItem.countDocuments({ user: req.user.id });

    res.json({ success: true, user, stats: { lostPosts: lostCount, foundPosts: foundCount } });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, country, street, zipCode } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (city || country || street || zipCode) {
      updates.address = {
        ...(req.user.address || {}),
        ...(city && { city }),
        ...(country && { country }),
        ...(street && { street }),
        ...(zipCode && { zipCode })
      };
    }

    // Handle avatar upload
    if (req.file) {
      updates.avatar = {
        public_id: req.file.filename,
        url: `/uploads/${req.file.filename}`
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, users });
  } catch (err) {
    next(err);
  }
};

// @desc    Ban/unban user (admin)
// @route   PATCH /api/users/:id/ban
// @access  Admin
exports.toggleBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot ban admin.' });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'}.`, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/me
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.json({ success: true, message: 'Account deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/users/admin/stats
// @access  Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalLost, totalFound, activeLost, activeFound] = await Promise.all([
      User.countDocuments(),
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      LostItem.countDocuments({ status: 'active' }),
      FoundItem.countDocuments({ status: 'available' })
    ]);
    res.json({ success: true, stats: { totalUsers, totalLost, totalFound, activeLost, activeFound } });
  } catch (err) {
    next(err);
  }
};
