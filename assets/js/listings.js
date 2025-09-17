
/**
 * STELLARADS - Listing Model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 5000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'STELLAR'
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'excellent', 'good', 'fair'],
    required: true
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'draft'],
    default: 'active'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumFeatures: {
    featured: {
      type: Boolean,
      default: false
    },
    highlighted: {
      type: Boolean,
      default: false
    },
    urgent: {
      type: Boolean,
      default: false
    },
    topOfSearch: {
      type: Boolean,
      default: false
    }
  },
  location: {
    city: String,
    region: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    phone: {
      type: Boolean,
      default: false
    },
    inAppMessage: {
      type: Boolean,
      default: true
    }
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
});

// Index for search performance
ListingSchema.index({ category: 1, status: 1 });
ListingSchema.index({ userId: 1, status: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ isPremium: -1, createdAt: -1 });
ListingSchema.index({ 
  title: 'text', 
  description: 'text' 
}, {
  weights: {
    title: 10,
    description: 5
  }
});

// Virtual for time remaining before expiration
ListingSchema.virtual('timeRemaining').get(function() {
  if (!this.expiresAt) return 0;
  const now = new Date();
  return Math.max(0, this.expiresAt - now);
});

// Pre-save middleware to check expiration
ListingSchema.pre('save', function(next) {
  if (this.expiresAt < new Date() && this.status === 'active') {
    this.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('Listing', ListingSchema);
