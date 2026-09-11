const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['LostItem', 'FoundItem']
  },
  reason: {
    type: String,
    required: [true, 'Report reason is required'],
    enum: [
      'fake_listing',
      'inappropriate_content',
      'spam',
      'fraud_attempt',
      'privacy_violation',
      'duplicate',
      'other'
    ]
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNote: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
