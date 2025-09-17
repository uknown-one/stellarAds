
/**
 * STELLARADS - Futuristic Classified Ads Platform
 * Backend Server Reference Implementation
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'stellarads-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Database connection (would use environment variables in production)
mongoose.connect('mongodb://localhost:27017/stellarads', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Import models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Affiliate = require('./models/Affiliate');
const Referral = require('./models/Referral');
const Transaction = require('./models/Transaction');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Premium account middleware
const isPremiumUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.accountType !== 'premium') {
      return res.status(403).json({ error: 'Premium account required for this action' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      username,
      email,
      passwordHash: hashedPassword,
      accountType: 'free',
      credits: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await user.save();
    
    // Create affiliate account
    const affiliate = new Affiliate({
      userId: user._id,
      referralCode: `${username}${Math.floor(Math.random() * 1000)}`,
      tier: 'bronze',
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: 0,
      availableCredits: 0,
      withdrawnCredits: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await affiliate.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Validate password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User routes
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const { username, contactInfo, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update fields
    if (username) user.username = username;
    if (contactInfo) user.contactInfo = { ...user.contactInfo, ...contactInfo };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    user.updatedAt = new Date();
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        contactInfo: user.contactInfo,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upgrade to premium
app.post('/api/users/upgrade', authenticateToken, async (req, res) => {
  try {
    const { paymentMethod, paymentId } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real app, you would process payment here
    
    // Update user to premium
    user.accountType = 'premium';
    user.premium = {
      subscriptionStart: new Date(),
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      autoRenew: true,
      features: ['unlimited_listings', 'featured_listings', 'priority_support']
    };
    user.updatedAt = new Date();
    await user.save();
    
    // Create transaction record
    const transaction = new Transaction({
      buyerId: user._id,
      sellerId: null, // Platform transaction
      listingId: null, // Not related to a listing
      amount: 299, // Premium subscription price
      currency: 'STELLAR',
      status: 'completed',
      paymentMethod,
      paymentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: new Date()
    });
    
    await transaction.save();
    
    res.json({
      message: 'Upgraded to premium successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        premium: user.premium
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Listing routes
app.get('/api/listings', async (req, res) => {
  try {
    const { category, status, sort, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    
    // Default to active listings
    if (!status) query.status = 'active';
    
    // Sorting options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        // Default sort: premium first, then newest
        sortOption = { isPremium: -1, createdAt: -1 };
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Get listings
    const listings = await Listing.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username');
    
    // Get total count for pagination
    const total = await Listing.countDocuments(query);
    
    res.json({
      listings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('userId', 'username');
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Increment view count
    listing.views += 1;
    await listing.save();
    
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/listings', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      subcategory,
      condition,
      images,
      location,
      contactPreferences,
      premiumFeatures
    } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check listing limits for free users
    if (user.accountType === 'free') {
      const activeListingsCount = await Listing.countDocuments({
        userId: user._id,
        status: 'active'
      });
      
      if (activeListingsCount >= 3) {
        return res.status(403).json({
          error: 'Free account limit reached',
          message: 'You have reached the maximum of 3 active listings for free accounts. Upgrade to premium for unlimited listings.'
        });
      }
    }
    
    // Create new listing
    const listing = new Listing({
      userId: user._id,
      title,
      description,
      price,
      currency: 'STELLAR',
      category,
      subcategory,
      condition,
      images,
      status: 'active',
      isPremium: user.accountType === 'premium',
      premiumFeatures: user.accountType === 'premium' ? premiumFeatures : {},
      location,
      contactPreferences,
      views: 0,
      favorites: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    await listing.save();
    
    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Check if user owns the listing
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }
    
    const {
      title,
      description,
      price,
      category,
      subcategory,
      condition,
      images,
      status,
      location,
      contactPreferences,
      premiumFeatures
    } = req.body;
    
    // Update fields
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (category) listing.category = category;
    if (subcategory) listing.subcategory = subcategory;
    if (condition) listing.condition = condition;
    if (images) listing.images = images;
    if (status) listing.status = status;
    if (location) listing.location = { ...listing.location, ...location };
    if (contactPreferences) listing.contactPreferences = { ...listing.contactPreferences, ...contactPreferences };
    
    // Premium features can only be updated by premium users
    const user = await User.findById(req.user.id);
    if (user.accountType === 'premium' && premiumFeatures) {
      listing.premiumFeatures = { ...listing.premiumFeatures, ...premiumFeatures };
    }
    
    listing.updatedAt = new Date();
    await listing.save();
    
    res.json({
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Check if user owns the listing
    if (listing.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }
    
    await listing.remove();
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Affiliate routes
app.get('/api/affiliate', authenticateToken, async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ userId: req.user.id });
    
    if (!affiliate) {
      return res.status(404).json({ error: 'Affiliate account not found' });
    }
    
    // Get recent referrals
    const recentReferrals = await Referral.find({ affiliateId: affiliate._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('referredId', 'username');
    
    res.json({
      affiliate,
      recentReferrals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/affiliate/referral', async (req, res) => {
  try {
    const { referralCode } = req.body;
    
    // Find affiliate by referral code
    const affiliate = await Affiliate.findOne({ referralCode });
    
    if (!affiliate) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }
    
    // Store referral code in session or cookie for later use during registration
    // In a real app, you would store this in the user's session
    
    res.json({
      message: 'Referral code applied successfully',
      referralCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
