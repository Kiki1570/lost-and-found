const LostItem = require('../models/LostItem');
const path = require('path');

// @desc    Get all lost items
// @route   GET /api/lost
// @access  Public
exports.getLostItems = async (req, res, next) => {
  try {
    const { category, status, city, country, search, page = 1, limit = 12 } = req.query;
    const query = { isPublic: true, isApproved: true };

    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = 'active';
    if (city) query['locationLost.city'] = new RegExp(city, 'i');
    if (country) query['locationLost.country'] = new RegExp(country, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') }
      ];
    }

    const total = await LostItem.countDocuments(query);
    const items = await LostItem.find(query)
      .populate('user', 'name avatar city')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single lost item
// @route   GET /api/lost/:id
// @access  Public
exports.getLostItem = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id).populate('user', 'name avatar address phone email');
    if (!item) return res.status(404).json({ success: false, message: 'Lost item not found.' });

    // Increment view count
    item.views += 1;
    await item.save({ validateBeforeSave: false });

    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// @desc    Create lost item post
// @route   POST /api/lost
// @access  Private
exports.createLostItem = async (req, res, next) => {
  try {
    const {
      title, description, category, dateLost, locationAddress, locationCity,
      locationCountry, contactPhone, contactEmail, ownerCity, ownerCountry,
      ownerStreet, ownerZip, rewardOffered, rewardAmount, rewardCurrency,
      identifierNumber, color, brand, additionalDetails, reportedToPolice, policeReportNumber
    } = req.body;

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          public_id: file.filename,
          url: `/uploads/${file.filename}`
        });
      });
    }

    const lostItem = await LostItem.create({
      user: req.user.id,
      title,
      description,
      category,
      images,
      dateLost,
      locationLost: {
        address: locationAddress,
        city: locationCity,
        country: locationCountry
      },
      contactPhone,
      contactEmail,
      ownerAddress: {
        city: ownerCity,
        country: ownerCountry,
        street: ownerStreet,
        zipCode: ownerZip
      },
      reward: {
        offered: rewardOffered === 'true' || rewardOffered === true,
        amount: rewardAmount,
        currency: rewardCurrency || 'USD'
      },
      identifierNumber,
      color,
      brand,
      additionalDetails,
      reportedToPolice: reportedToPolice === 'true' || reportedToPolice === true,
      policeReportNumber
    });

    res.status(201).json({ success: true, item: lostItem });
  } catch (err) {
    next(err);
  }
};

// @desc    Update lost item
// @route   PUT /api/lost/:id
// @access  Private
exports.updateLostItem = async (req, res, next) => {
  try {
    let item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    item = await LostItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete lost item
// @route   DELETE /api/lost/:id
// @access  Private
exports.deleteLostItem = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Lost item removed.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's lost items
// @route   GET /api/lost/my-items
// @access  Private
exports.getMyLostItems = async (req, res, next) => {
  try {
    const items = await LostItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark as found
// @route   PATCH /api/lost/:id/found
// @access  Private
exports.markAsFound = async (req, res, next) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    item.status = 'found';
    await item.save();
    res.json({ success: true, message: 'Item marked as found!', item });
  } catch (err) {
    next(err);
  }
};
