/**
 * STELLARADS - Configuration
 * This file contains environment-specific configuration settings
 */

// Environment detection
const isProduction = window.location.hostname !== 'localhost' && 
                     !window.location.hostname.includes('127.0.0.1');

// Configuration settings
const CONFIG = {
  // API settings
  api: {
    // Change this URL to your deployed backend URL in production
    baseUrl: isProduction 
      ? 'https://api.stellarads.com/api'  // Production API URL
      : 'http://localhost:3000/api',      // Development API URL
    
    timeout: 10000, // 10 seconds
    
    // Default headers for API requests
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  
  // Authentication settings
  auth: {
    tokenKey: 'stellarads_token',
    userKey: 'stellarads_user',
    
    // Routes that require authentication
    protectedRoutes: [
      '/post-ad.html',
      '/affiliate.html',
      '/account.html'
    ]
  },
  
  // Feature flags
  features: {
    enableSocialLogin: false,
    enablePushNotifications: false,
    enableRealTimeChat: false
  },
  
  // External services
  services: {
    analytics: {
      enabled: isProduction,
      trackingId: 'UA-XXXXXXXXX-X'
    },
    
    payment: {
      provider: 'stripe',
      publicKey: isProduction
        ? 'pk_live_XXXXXXXXXXXXXXXXXXXXXXXX'
        : 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'
    }
  }
};

// Export configuration
window.STELLARADS_CONFIG = CONFIG;
