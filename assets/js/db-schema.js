
/**
 * STELLARADS - Futuristic Classified Ads Platform
 * Database Schema Definition
 * 
 * This file defines the database schema for the STELLARADS platform.
 * In a production environment, this would be implemented using a proper database system.
 */

// User Schema
const UserSchema = {
  id: "String (UUID)", // Primary Key
  username: "String (unique)",
  email: "String (unique)",
  passwordHash: "String",
  accountType: "String (enum: free, premium)",
  credits: "Number",
  createdAt: "Date",
  updatedAt: "Date",
  lastLogin: "Date",
  profilePicture: "String (URL)",
  contactInfo: {
    phone: "String",
    address: "String",
    city: "String",
    country: "String"
  },
  preferences: {
    notifications: "Boolean",
    newsletter: "Boolean",
    contactPreferences: "Object"
  },
  premium: {
    subscriptionStart: "Date",
    subscriptionEnd: "Date",
    autoRenew: "Boolean",
    features: "Array"
  }
};

// Listing Schema
const ListingSchema = {
  id: "String (UUID)", // Primary Key
  userId: "String (UUID)", // Foreign Key to User
  title: "String",
  description: "String",
  price: "Number",
  currency: "String",
  category: "String",
  subcategory: "String",
  condition: "String (enum: new, like-new, excellent, good, fair)",
  images: ["String (URL)"],
  status: "String (enum: active, sold, expired, draft)",
  isPremium: "Boolean",
  premiumFeatures: {
    featured: "Boolean",
    highlighted: "Boolean",
    urgent: "Boolean",
    topOfSearch: "Boolean"
  },
  location: {
    city: "String",
    region: "String",
    country: "String",
    coordinates: {
      latitude: "Number",
      longitude: "Number"
    }
  },
  contactPreferences: {
    email: "Boolean",
    phone: "Boolean",
    inAppMessage: "Boolean"
  },
  views: "Number",
  favorites: "Number",
  createdAt: "Date",
  updatedAt: "Date",
  expiresAt: "Date",
  metadata: "Object" // For additional custom fields
};

// Category Schema
const CategorySchema = {
  id: "String (UUID)", // Primary Key
  name: "String",
  slug: "String (unique)",
  description: "String",
  icon: "String",
  parentId: "String (UUID or null)", // Self-reference for hierarchical categories
  order: "Number",
  isActive: "Boolean",
  createdAt: "Date",
  updatedAt: "Date"
};

// Message Schema
const MessageSchema = {
  id: "String (UUID)", // Primary Key
  conversationId: "String (UUID)", // Foreign Key to Conversation
  senderId: "String (UUID)", // Foreign Key to User
  receiverId: "String (UUID)", // Foreign Key to User
  content: "String",
  isRead: "Boolean",
  createdAt: "Date",
  attachments: ["String (URL)"]
};

// Conversation Schema
const ConversationSchema = {
  id: "String (UUID)", // Primary Key
  participants: ["String (UUID)"], // Array of User IDs
  listingId: "String (UUID)", // Foreign Key to Listing
  lastMessageAt: "Date",
  createdAt: "Date",
  isActive: "Boolean"
};

// Transaction Schema
const TransactionSchema = {
  id: "String (UUID)", // Primary Key
  buyerId: "String (UUID)", // Foreign Key to User
  sellerId: "String (UUID)", // Foreign Key to User
  listingId: "String (UUID)", // Foreign Key to Listing
  amount: "Number",
  currency: "String",
  status: "String (enum: pending, completed, cancelled, refunded)",
  paymentMethod: "String",
  paymentId: "String", // External payment reference
  createdAt: "Date",
  updatedAt: "Date",
  completedAt: "Date"
};

// Review Schema
const ReviewSchema = {
  id: "String (UUID)", // Primary Key
  reviewerId: "String (UUID)", // Foreign Key to User (who wrote the review)
  revieweeId: "String (UUID)", // Foreign Key to User (who is being reviewed)
  listingId: "String (UUID)", // Foreign Key to Listing
  transactionId: "String (UUID)", // Foreign Key to Transaction
  rating: "Number (1-5)",
  content: "String",
  createdAt: "Date",
  updatedAt: "Date",
  isVerifiedPurchase: "Boolean"
};

// Affiliate Schema
const AffiliateSchema = {
  id: "String (UUID)", // Primary Key
  userId: "String (UUID)", // Foreign Key to User
  referralCode: "String (unique)",
  tier: "String (enum: bronze, silver, gold)",
  totalReferrals: "Number",
  activeReferrals: "Number",
  totalEarnings: "Number",
  availableCredits: "Number",
  withdrawnCredits: "Number",
  createdAt: "Date",
  updatedAt: "Date"
};

// Referral Schema
const ReferralSchema = {
  id: "String (UUID)", // Primary Key
  affiliateId: "String (UUID)", // Foreign Key to Affiliate
  referrerId: "String (UUID)", // Foreign Key to User (who referred)
  referredId: "String (UUID)", // Foreign Key to User (who was referred)
  status: "String (enum: pending, completed, expired)",
  reward: "Number",
  createdAt: "Date",
  completedAt: "Date"
};

// Notification Schema
const NotificationSchema = {
  id: "String (UUID)", // Primary Key
  userId: "String (UUID)", // Foreign Key to User
  type: "String (enum: message, transaction, system, etc.)",
  title: "String",
  content: "String",
  isRead: "Boolean",
  relatedId: "String (UUID)", // ID of related entity (message, listing, etc.)
  relatedType: "String", // Type of related entity
  createdAt: "Date"
};

// Analytics Schema
const AnalyticsSchema = {
  id: "String (UUID)", // Primary Key
  userId: "String (UUID)", // Foreign Key to User
  listingId: "String (UUID)", // Foreign Key to Listing
  views: "Number",
  uniqueVisitors: "Number",
  clicksOnContact: "Number",
  favorites: "Number",
  searchAppearances: "Number",
  conversionRate: "Number",
  date: "Date",
  deviceStats: {
    mobile: "Number",
    desktop: "Number",
    tablet: "Number"
  },
  referrers: "Object" // Sources of traffic
};

// Example Relationships
const DatabaseRelationships = {
  "User-Listing": "One-to-Many (A user can have multiple listings)",
  "User-Affiliate": "One-to-One (A user can have one affiliate account)",
  "Affiliate-Referral": "One-to-Many (An affiliate can have multiple referrals)",
  "User-Conversation": "Many-to-Many (Users can participate in multiple conversations)",
  "Listing-Conversation": "One-to-Many (A listing can have multiple conversations)",
  "User-Notification": "One-to-Many (A user can have multiple notifications)",
  "User-Review": "One-to-Many (A user can give and receive multiple reviews)",
  "Listing-Transaction": "One-to-One (A listing can have one transaction)",
  "Category-Subcategory": "One-to-Many (Self-referential relationship)"
};

// Example Indexes for Performance
const DatabaseIndexes = {
  "User": ["email", "username"],
  "Listing": ["userId", "category", "status", "createdAt", "price"],
  "Conversation": ["participants", "listingId", "lastMessageAt"],
  "Message": ["conversationId", "senderId", "receiverId", "createdAt"],
  "Transaction": ["buyerId", "sellerId", "listingId", "status"],
  "Affiliate": ["userId", "referralCode"],
  "Referral": ["affiliateId", "status"],
  "Notification": ["userId", "isRead", "createdAt"]
};

// Export schemas (in a real application, these would be used to create database models)
module.exports = {
  UserSchema,
  ListingSchema,
  CategorySchema,
  MessageSchema,
  ConversationSchema,
  TransactionSchema,
  ReviewSchema,
  AffiliateSchema,
  ReferralSchema,
  NotificationSchema,
  AnalyticsSchema,
  DatabaseRelationships,
  DatabaseIndexes
};
