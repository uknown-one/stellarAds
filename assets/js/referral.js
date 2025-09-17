
/**
 * STELLARADS - Referral Model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferralSchema = new Schema({
  affiliateId: {
    type: Schema.Types.ObjectId,
    ref: 'Affiliate',
    required: true
  },
  referrerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  reward: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Index for performance
ReferralSchema.index({ affiliateId: 1, status: 1 });
ReferralSchema.index({ referredId: 1 }, { unique: true });

// Pre-save middleware to check expiration
ReferralSchema.pre('save', function(next) {
  // If status is changing to completed, set completedAt
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Check if referral has expired (30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  if (this.status === 'pending' && this.createdAt < thirtyDaysAgo) {
    this.status = 'expired';
  }
  
  next();
});

module.exports = mongoose.model('Referral', ReferralSchema);
