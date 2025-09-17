
/**
 * STELLARADS - API Integration
 * This file handles communication with the backend API
 */

// API Configuration
const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api', // Change to your production API URL in production
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Token management
const TokenService = {
  getToken() {
    return localStorage.getItem('stellarads_token');
  },
  
  setToken(token) {
    localStorage.setItem('stellarads_token', token);
  },
  
  removeToken() {
    localStorage.removeItem('stellarads_token');
  },
  
  isAuthenticated() {
    return !!this.getToken();
  }
};

// User management
const UserService = {
  getCurrentUser() {
    const userJson = localStorage.getItem('stellarads_user');
    return userJson ? JSON.parse(userJson) : null;
  },
  
  setCurrentUser(user) {
    localStorage.setItem('stellarads_user', JSON.stringify(user));
  },
  
  removeCurrentUser() {
    localStorage.removeItem('stellarads_user');
  }
};

// API Client
const ApiClient = {
  // Helper method to build request options
  _buildRequestOptions(method, data = null, requiresAuth = true) {
    const options = {
      method,
      headers: { ...API_CONFIG.headers }
    };
    
    // Add authorization header if required
    if (requiresAuth) {
      const token = TokenService.getToken();
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Add request body for POST, PUT, PATCH
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(data);
    }
    
    return options;
  },
  
  // Helper method to handle API responses
  async _handleResponse(response) {
    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Unknown error occurred' };
      }
      
      // Handle 401 Unauthorized (token expired or invalid)
      if (response.status === 401) {
        TokenService.removeToken();
        UserService.removeCurrentUser();
        // Redirect to login page or show login modal
        window.location.href = '/login.html';
      }
      
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    // Parse JSON response
    const data = await response.json();
    return data;
  },
  
  // Generic request method
  async request(endpoint, method, data = null, requiresAuth = true) {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const options = this._buildRequestOptions(method, data, requiresAuth);
    
    try {
      const response = await fetch(url, options);
      return await this._handleResponse(response);
    } catch (error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
  },
  
  // Convenience methods for common HTTP verbs
  get(endpoint, requiresAuth = true) {
    return this.request(endpoint, 'GET', null, requiresAuth);
  },
  
  post(endpoint, data, requiresAuth = true) {
    return this.request(endpoint, 'POST', data, requiresAuth);
  },
  
  put(endpoint, data, requiresAuth = true) {
    return this.request(endpoint, 'PUT', data, requiresAuth);
  },
  
  patch(endpoint, data, requiresAuth = true) {
    return this.request(endpoint, 'PATCH', data, requiresAuth);
  },
  
  delete(endpoint, requiresAuth = true) {
    return this.request(endpoint, 'DELETE', null, requiresAuth);
  }
};

// Authentication API
const AuthAPI = {
  async register(userData) {
    try {
      const response = await ApiClient.post('/auth/register', userData, false);
      TokenService.setToken(response.token);
      UserService.setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  async login(credentials) {
    try {
      const response = await ApiClient.post('/auth/login', credentials, false);
      TokenService.setToken(response.token);
      UserService.setCurrentUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  logout() {
    TokenService.removeToken();
    UserService.removeCurrentUser();
    // Redirect to home page
    window.location.href = '/index.html';
  }
};

// User API
const UserAPI = {
  async getProfile() {
    return ApiClient.get('/users/me');
  },
  
  async updateProfile(userData) {
    return ApiClient.put('/users/me', userData);
  },
  
  async upgradeToPremium(paymentData) {
    return ApiClient.post('/users/upgrade', paymentData);
  }
};

// Listings API
const ListingsAPI = {
  async getListings(params = {}) {
    // Convert params object to query string
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return ApiClient.get(`/listings${queryString ? `?${queryString}` : ''}`);
  },
  
  async getListing(id) {
    return ApiClient.get(`/listings/${id}`);
  },
  
  async createListing(listingData) {
    return ApiClient.post('/listings', listingData);
  },
  
  async updateListing(id, listingData) {
    return ApiClient.put(`/listings/${id}`, listingData);
  },
  
  async deleteListing(id) {
    return ApiClient.delete(`/listings/${id}`);
  }
};

// Affiliate API
const AffiliateAPI = {
  async getAffiliateInfo() {
    return ApiClient.get('/affiliate');
  },
  
  async applyReferralCode(referralCode) {
    return ApiClient.post('/affiliate/referral', { referralCode }, false);
  }
};

// Export all API services
window.STELLARADS_API = {
  TokenService,
  UserService,
  ApiClient,
  AuthAPI,
  UserAPI,
  ListingsAPI,
  AffiliateAPI
};

// Initialize authentication state
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is authenticated
  const isAuthenticated = TokenService.isAuthenticated();
  const currentUser = UserService.getCurrentUser();
  
  // Update UI based on authentication state
  const authElements = document.querySelectorAll('[data-auth-required]');
  const guestElements = document.querySelectorAll('[data-guest-only]');
  const premiumElements = document.querySelectorAll('[data-premium-only]');
  
  // Show/hide elements based on authentication
  authElements.forEach(el => {
    el.style.display = isAuthenticated ? '' : 'none';
  });
  
  guestElements.forEach(el => {
    el.style.display = !isAuthenticated ? '' : 'none';
  });
  
  // Show/hide premium elements
  if (isAuthenticated && currentUser && currentUser.accountType === 'premium') {
    premiumElements.forEach(el => {
      el.style.display = '';
    });
  } else {
    premiumElements.forEach(el => {
      el.style.display = 'none';
    });
  }
  
  // Update user info in the UI
  if (isAuthenticated && currentUser) {
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
      el.textContent = currentUser.username;
    });
  }
});
