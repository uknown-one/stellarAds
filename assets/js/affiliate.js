
/**
 * STELLARADS - Affiliate Model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AffiliateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    default: 'bronze'
  },
  totalReferrals: {
    type: Number,
    default: 0
  },
  activeReferrals: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  availableCredits: {
    type: Number,
    default: 0
  },
  withdrawnCredits: {
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
  }
});

// Method to calculate reward based on tier
AffiliateSchema.methods.calculateReward = function() {
  switch (this.tier) {
    case 'gold':
      return 50;
    case 'silver':
      return 35;
    case 'bronze':
    default:
      return 20;
  }
};

// Method to update tier based on total referrals
AffiliateSchema.methods.updateTier = function() {
  if (this.totalReferrals >= 100) {
    this.tier = 'gold';
  } else if (this.totalReferrals >= 50) {
    this.tier = 'silver';
  } else {
    this.tier = 'bronze';
  }
  return this.tier;
};

// Pre-save middleware to update tier
AffiliateSchema.pre('save', function(next) {
  if (this.isModified('totalReferrals')) {
    this.updateTier();
  }
  next();
});

module.exports = mongoose.model('Affiliate', AffiliateSchema);
