const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
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
  dateFound: {
    type: Date,
    required: [true, 'Date found is required']
  },
  locationFound: {
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
      required: [true, 'Location where item was found is required']
    },
    city: String,
    country: String
  },
  handoverLocation: {
    type: String,
    required: [true, 'Handover/pickup location is required']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone number is required']
  },
  contactEmail: String,
  finderAddress: {
    city: { type: String, required: [true, 'Finder city is required'] },
    country: { type: String, required: [true, 'Finder country is required'] },
    street: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'returned', 'with_authorities', 'closed'],
    default: 'available'
  },
  isApproved: {
    type: Boolean,
    default: true
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
    trim: true
  },
  color: String,
  brand: String,
  additionalDetails: String,
  handedToAuthorities: {
    type: Boolean,
    default: false
  },
  authorityName: String,
  authorityContact: String,
  // Link to a matched lost item
  matchedLostItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostItem'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  }
}, {
  timestamps: true
});

foundItemSchema.index({ locationFound: '2dsphere' });
foundItemSchema.index({ category: 1, status: 1 });
foundItemSchema.index({ user: 1 });
foundItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FoundItem', foundItemSchema);
