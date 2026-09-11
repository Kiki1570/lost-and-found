const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'passport',
      'national_id',
      'car_licence',
      'drivers_licence',
      'wallet',
      'phone',
      'keys',
      'bag',
      'jewelry',
      'electronics',
      'documents',
      'clothing',
      'pet',
      'vehicle',
      'other'
    ]
  },
  images: [{
    public_id: String,
    url: String
  }],
  dateLost: {
    type: Date,
    required: [true, 'Date lost is required']
  },
  locationLost: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      required: [true, 'Location where item was lost is required']
    },
    city: String,
    country: String
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone number is required']
  },
  contactEmail: String,
  ownerAddress: {
    city: { type: String, required: [true, 'Owner city is required'] },
    country: { type: String, required: [true, 'Owner country is required'] },
    street: String,
    zipCode: String
  },
  reward: {
    offered: { type: Boolean, default: false },
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  status: {
    type: String,
    enum: ['active', 'found', 'closed', 'pending_review'],
    default: 'active'
  },
  isApproved: {
    type: Boolean,
    default: true // auto-approve, admin can review
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  identifierNumber: {
    type: String,
    trim: true // For IDs, passports, licence numbers etc.
  },
  color: String,
  brand: String,
  additionalDetails: String,
  reportedToPolice: {
    type: Boolean,
    default: false
  },
  policeReportNumber: String,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  }
}, {
  timestamps: true
});

lostItemSchema.index({ locationLost: '2dsphere' });
lostItemSchema.index({ category: 1, status: 1 });
lostItemSchema.index({ user: 1 });
lostItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LostItem', lostItemSchema);
