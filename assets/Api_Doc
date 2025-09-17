STELLARADS API Documentation

This document provides information about the STELLARADS API endpoints, request/response formats, and authentication requirements.


Base URL

https://api.stellarads.com/v1


For local development:

http://localhost:3000/api


Authentication

Most endpoints require authentication using JSON Web Tokens (JWT).


Headers

Include the JWT token in the Authorization header:


Authorization: Bearer <your_jwt_token>


Getting a Token

To get a JWT token, use the login or register endpoints.


Endpoints

Authentication

Register a new user

POST /auth/register


**Request Body:**

{
  "username": "stellar_user",
  "email": "user@example.com",
  "password": "securepassword123"
}


**Response:**

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "stellar_user",
    "email": "user@example.com",
    "accountType": "free"
  }
}


Login

POST /auth/login


**Request Body:**

{
  "email": "user@example.com",
  "password": "securepassword123"
}


**Response:**

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "stellar_user",
    "email": "user@example.com",
    "accountType": "free"
  }
}


User Management

Get current user profile

GET /users/me


**Response:**

{
  "id": "60d21b4667d0d8992e610c85",
  "username": "stellar_user",
  "email": "user@example.com",
  "accountType": "free",
  "credits": 0,
  "createdAt": "2023-06-22T10:30:00.000Z",
  "updatedAt": "2023-06-22T10:30:00.000Z",
  "lastLogin": "2023-06-22T10:30:00.000Z",
  "contactInfo": {
    "phone": null,
    "address": null,
    "city": null,
    "country": null
  },
  "preferences": {
    "notifications": true,
    "newsletter": true,
    "contactPreferences": {
      "email": true,
      "phone": false,
      "inAppMessage": true
    }
  }
}


Update user profile

PUT /users/me


**Request Body:**

{
  "username": "new_username",
  "contactInfo": {
    "phone": "1234567890",
    "city": "Neo Tokyo"
  },
  "preferences": {
    "notifications": false
  }
}


**Response:**

{
  "message": "Profile updated successfully",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "new_username",
    "email": "user@example.com",
    "accountType": "free",
    "contactInfo": {
      "phone": "1234567890",
      "city": "Neo Tokyo"
    },
    "preferences": {
      "notifications": false,
      "newsletter": true,
      "contactPreferences": {
        "email": true,
        "phone": false,
        "inAppMessage": true
      }
    }
  }
}


Upgrade to premium

POST /users/upgrade


**Request Body:**

{
  "paymentMethod": "credit_card",
  "paymentId": "pm_card_visa_123456"
}


**Response:**

{
  "message": "Upgraded to premium successfully",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "stellar_user",
    "email": "user@example.com",
    "accountType": "premium",
    "premium": {
      "subscriptionStart": "2023-06-22T10:30:00.000Z",
      "subscriptionEnd": "2023-07-22T10:30:00.000Z",
      "autoRenew": true,
      "features": ["unlimited_listings", "featured_listings", "priority_support"]
    }
  }
}


Listings

Get all listings

GET /listings


**Query Parameters:**
• `category` - Filter by category
• `status` - Filter by status (active, sold, expired)
• `sort` - Sort order (price_asc, price_desc, newest, oldest)
• `limit` - Number of results per page (default: 20)
• `page` - Page number (default: 1)


**Response:**

{
  "listings": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "userId": {
        "id": "60d21b4667d0d8992e610c85",
        "username": "stellar_user"
      },
      "title": "Quantum Drone Pro",
      "description": "Next-gen aerial surveillance with quantum stabilization and AI-enhanced imaging.",
      "price": 599,
      "currency": "STELLAR",
      "category": "tech",
      "subcategory": "drones",
      "condition": "new",
      "images": ["https://stellarads.com/images/listings/quantum-drone-1.jpg"],
      "status": "active",
      "isPremium": true,
      "premiumFeatures": {
        "featured": true,
        "highlighted": false,
        "urgent": false,
        "topOfSearch": true
      },
      "location": {
        "city": "Neo Tokyo",
        "country": "Japan"
      },
      "views": 42,
      "favorites": 5,
      "createdAt": "2023-06-20T15:45:00.000Z",
      "updatedAt": "2023-06-20T15:45:00.000Z",
      "expiresAt": "2023-07-20T15:45:00.000Z"
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "pages": 6
  }
}


Get a specific listing

GET /listings/:id


**Response:**

{
  "id": "60d21b4667d0d8992e610c86",
  "userId": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "stellar_user"
  },
  "title": "Quantum Drone Pro",
  "description": "Next-gen aerial surveillance with quantum stabilization and AI-enhanced imaging.",
  "price": 599,
  "currency": "STELLAR",
  "category": "tech",
  "subcategory": "drones",
  "condition": "new",
  "images": ["https://stellarads.com/images/listings/quantum-drone-1.jpg"],
  "status": "active",
  "isPremium": true,
  "premiumFeatures": {
    "featured": true,
    "highlighted": false,
    "urgent": false,
    "topOfSearch": true
  },
  "location": {
    "city": "Neo Tokyo",
    "country": "Japan"
  },
  "contactPreferences": {
    "email": true,
    "phone": false,
    "inAppMessage": true
  },
  "views": 43,
  "favorites": 5,
  "createdAt": "2023-06-20T15:45:00.000Z",
  "updatedAt": "2023-06-20T15:45:00.000Z",
  "expiresAt": "2023-07-20T15:45:00.000Z"
}


Create a new listing

POST /listings


**Request Body:**

{
  "title": "AI-Enhanced Tracker",
  "description": "Revolutionary tracking device with neural network processing.",
  "price": 299,
  "category": "tech",
  "subcategory": "gadgets",
  "condition": "new",
  "images": ["https://stellarads.com/images/listings/ai-tracker-1.jpg"],
  "location": {
    "city": "Neo Tokyo",
    "country": "Japan"
  },
  "contactPreferences": {
    "email": true,
    "phone": true,
    "inAppMessage": true
  },
  "premiumFeatures": {
    "featured": true,
    "highlighted": true
  }
}


**Response:**

{
  "message": "Listing created successfully",
  "listing": {
    "id": "60d21b4667d0d8992e610c87",
    "userId": "60d21b4667d0d8992e610c85",
    "title": "AI-Enhanced Tracker",
    "description": "Revolutionary tracking device with neural network processing.",
    "price": 299,
    "currency": "STELLAR",
    "category": "tech",
    "subcategory": "gadgets",
    "condition": "new",
    "images": ["https://stellarads.com/images/listings/ai-tracker-1.jpg"],
    "status": "active",
    "isPremium": true,
    "premiumFeatures": {
      "featured": true,
      "highlighted": true,
      "urgent": false,
      "topOfSearch": false
    },
    "location": {
      "city": "Neo Tokyo",
      "country": "Japan"
    },
    "contactPreferences": {
      "email": true,
      "phone": true,
      "inAppMessage": true
    },
    "views": 0,
    "favorites": 0,
    "createdAt": "2023-06-22T11:30:00.000Z",
    "updatedAt": "2023-06-22T11:30:00.000Z",
    "expiresAt": "2023-07-22T11:30:00.000Z"
  }
}


Update a listing

PUT /listings/:id


**Request Body:**

{
  "title": "AI-Enhanced Tracker Pro",
  "price": 349,
  "status": "active",
  "premiumFeatures": {
    "urgent": true
  }
}


**Response:**

{
  "message": "Listing updated successfully",
  "listing": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "AI-Enhanced Tracker Pro",
    "price": 349,
    "status": "active",
    "premiumFeatures": {
      "featured": true,
      "highlighted": true,
      "urgent": true,
      "topOfSearch": false
    },
    "updatedAt": "2023-06-22T12:00:00.000Z"
  }
}


Delete a listing

DELETE /listings/:id


**Response:**

{
  "message": "Listing deleted successfully"
}


Affiliate Program

Get affiliate information

GET /affiliate


**Response:**

{
  "affiliate": {
    "id": "60d21b4667d0d8992e610c88",
    "userId": "60d21b4667d0d8992e610c85",
    "referralCode": "stellar_user123",
    "tier": "bronze",
    "totalReferrals": 42,
    "activeReferrals": 12,
    "totalEarnings": 840,
    "availableCredits": 320,
    "withdrawnCredits": 520,
    "createdAt": "2023-06-22T10:30:00.000Z",
    "updatedAt": "2023-06-22T10:30:00.000Z"
  },
  "recentReferrals": [
    {
      "id": "60d21b4667d0d8992e610c89",
      "referredId": {
        "id": "60d21b4667d0d8992e610c90",
        "username": "CosmoUser92"
      },
      "status": "completed",
      "reward": 20,
      "createdAt": "2023-06-15T10:30:00.000Z",
      "completedAt": "2023-06-15T10:35:00.000Z"
    },
    {
      "id": "60d21b4667d0d8992e610c8a",
      "referredId": {
        "id": "60d21b4667d0d8992e610c91",
        "username": "NebulaTrader"
      },
      "status": "completed",
      "reward": 20,
      "createdAt": "2023-06-14T14:20:00.000Z",
      "completedAt": "2023-06-14T14:25:00.000Z"
    }
  ]
}


Apply referral code

POST /affiliate/referral


**Request Body:**

{
  "referralCode": "stellar_user123"
}


**Response:**

{
  "message": "Referral code applied successfully",
  "referralCode": "stellar_user123"
}


Error Responses

All endpoints return appropriate HTTP status codes:

• `200 OK` - Request succeeded
• `201 Created` - Resource created successfully
• `400 Bad Request` - Invalid request parameters
• `401 Unauthorized` - Missing or invalid authentication
• `403 Forbidden` - Authenticated but not authorized
• `404 Not Found` - Resource not found
• `500 Internal Server Error` - Server error


Error response format:


{
  "error": "Error message describing the issue"
}


Rate Limiting

API requests are limited to 100 requests per minute per IP address. When exceeded, the API will return a `429 Too Many Requests` status code.


Webhooks

Premium users can register webhook URLs to receive real-time notifications for events like new messages, listing views, and purchases.


To register a webhook:


POST /webhooks


**Request Body:**

{
  "url": "https://your-app.com/webhook",
  "events": ["message.new", "listing.view", "transaction.completed"]
}


SDK and Client Libraries

Official client libraries are available for:
• JavaScript/TypeScript
• Python
• Java
• Swift
• Kotlin


Visit our [Developer Portal](https://developers.stellarads.com) for more information.
