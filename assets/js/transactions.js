
/**
 * STELLARADS - Transaction Model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'STELLAR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  metadata: {
    type: Schema.Types.Mixed
  }
});

// Indexes for performance
TransactionSchema.index({ buyerId: 1 });
TransactionSchema.index({ sellerId: 1 });
TransactionSchema.index({ listingId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });

// Pre-save middleware
TransactionSchema.pre('save', function(next) {
  // Update timestamps
  this.updatedAt = new Date();
  
  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Virtual for transaction age
TransactionSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Method to process refund
TransactionSchema.methods.refund = async function() {
  if (this.status !== 'completed') {
    throw new Error('Only completed transactions can be refunded');
  }
  
  // In a real app, you would integrate with a payment gateway here
  
  this.status = 'refunded';
  this.updatedAt = new Date();
  
  return this.save();
};

module.exports = mongoose.model('Transaction', TransactionSchema);
