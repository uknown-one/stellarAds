
/**
 * STELLARADS - User Model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  credits: {
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
  lastLogin: {
    type: Date
  },
  profilePicture: {
    type: String
  },
  contactInfo: {
    phone: String,
    address: String,
    city: String,
    country: String
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
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
    }
  },
  premium: {
    subscriptionStart: Date,
    subscriptionEnd: Date,
    autoRenew: {
      type: Boolean,
      default: true
    },
    features: [String]
  }
});

// Virtual for checking if premium is active
UserSchema.virtual('isPremiumActive').get(function() {
  if (this.accountType !== 'premium') return false;
  if (!this.premium || !this.premium.subscriptionEnd) return false;
  return this.premium.subscriptionEnd > new Date();
});

// Pre-save middleware to check premium expiration
UserSchema.pre('save', function(next) {
  if (this.accountType === 'premium' && 
      this.premium && 
      this.premium.subscriptionEnd && 
      this.premium.subscriptionEnd < new Date() && 
      !this.premium.autoRenew) {
    this.accountType = 'free';
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
