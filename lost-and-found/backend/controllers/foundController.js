const FoundItem = require('../models/FoundItem');

// @desc    Get all found items
// @route   GET /api/found
// @access  Public
exports.getFoundItems = async (req, res, next) => {
  try {
    const { category, status, city, country, search, page = 1, limit = 12 } = req.query;
    const query = { isPublic: true, isApproved: true };

    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = 'available';
    if (city) query['locationFound.city'] = new RegExp(city, 'i');
    if (country) query['locationFound.country'] = new RegExp(country, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') }
      ];
    }

    const total = await FoundItem.countDocuments(query);
    const items = await FoundItem.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), items });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single found item
// @route   GET /api/found/:id
// @access  Public
exports.getFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id).populate('user', 'name avatar address phone email');
    if (!item) return res.status(404).json({ success: false, message: 'Found item not found.' });

    item.views += 1;
    await item.save({ validateBeforeSave: false });

    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// @desc    Create found item post
// @route   POST /api/found
// @access  Private
exports.createFoundItem = async (req, res, next) => {
  try {
    const {
      title, description, category, dateFound, locationAddress, locationCity,
      locationCountry, handoverLocation, contactPhone, contactEmail,
      finderCity, finderCountry, finderStreet, finderZip,
      identifierNumber, color, brand, additionalDetails,
      handedToAuthorities, authorityName, authorityContact
    } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          public_id: file.filename,
          url: `/uploads/${file.filename}`
        });
      });
    }

    const foundItem = await FoundItem.create({
      user: req.user.id,
      title,
      description,
      category,
      images,
      dateFound,
      locationFound: {
        address: locationAddress,
        city: locationCity,
        country: locationCountry
      },
      handoverLocation,
      contactPhone,
      contactEmail,
      finderAddress: {
        city: finderCity,
        country: finderCountry,
        street: finderStreet,
        zipCode: finderZip
      },
      identifierNumber,
      color,
      brand,
      additionalDetails,
      handedToAuthorities: handedToAuthorities === 'true' || handedToAuthorities === true,
      authorityName,
      authorityContact
    });

    res.status(201).json({ success: true, item: foundItem });
  } catch (err) {
    next(err);
  }
};

// @desc    Update found item
// @route   PUT /api/found/:id
// @access  Private
exports.updateFoundItem = async (req, res, next) => {
  try {
    let item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    item = await FoundItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete found item
// @route   DELETE /api/found/:id
// @access  Private
exports.deleteFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Found item removed.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's found items
// @route   GET /api/found/my-items
// @access  Private
exports.getMyFoundItems = async (req, res, next) => {
  try {
    const items = await FoundItem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

// @desc    Claim found item
// @route   PATCH /api/found/:id/claim
// @access  Private
exports.claimFoundItem = async (req, res, next) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
    if (item.status !== 'available') {
      return res.status(400).json({ success: false, message: 'This item has already been claimed.' });
    }

    item.status = 'claimed';
    item.claimedBy = req.user.id;
    await item.save();

    res.json({ success: true, message: 'Item claim registered. The finder will contact you.', item });
  } catch (err) {
    next(err);
  }
};
