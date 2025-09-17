STELLARADS - Futuristic Classified Ads Platform

STELLARADS is a lightweight, futuristic classified ads platform featuring a sleek, intuitive user interface with a dark mode aesthetic and glowing accents. The platform allows users to post listings with a clear distinction between free and premium accounts.


![STELLARADS Platform](src/images/stellarads-preview.png)


Features

Core Functionality
• **User Accounts**: Free and premium tiers with different capabilities
• **Listing Management**: Post, edit, and manage classified ads
• **Browsing Experience**: Search, filter, and view listings
• **Purchase Options**: Buy directly or get redirected to external sites
• **Affiliate Program**: Invite friends using unique referral links and earn rewards


Premium Account Benefits
• Increased posting limits
• Prominent ad rotation placements
• Enhanced visibility in search results
• Advanced analytics and insights
• Priority customer support


User Interface
• Dark mode aesthetic with glowing accents
• Responsive design for all devices
• Intuitive navigation and user flow
• Futuristic visual elements and animations


Project Structure

stellarads/
\u251c\u2500\u2500 src/
\u2502   \u251c\u2500\u2500 css/
\u2502   \u2502   \u2514\u2500\u2500 style.css          # Main stylesheet
\u2502   \u251c\u2500\u2500 js/
\u2502   \u2502   \u2514\u2500\u2500 main.js            # Core JavaScript functionality
\u2502   \u251c\u2500\u2500 images/                # Image assets
\u2502   \u251c\u2500\u2500 index.html             # Homepage
\u2502   \u251c\u2500\u2500 post-ad.html           # Ad creation page
\u2502   \u251c\u2500\u2500 affiliate.html         # Affiliate program dashboard
\u2502   \u251c\u2500\u2500 premium.html           # Premium account information
\u2502   \u2514\u2500\u2500 db-schema.js           # Database schema definition
\u251c\u2500\u2500 README.md                  # Project documentation
\u2514\u2500\u2500 todo.md                    # Development tasks


Pages

Home Page

The main landing page showcasing premium and recent listings, with navigation to all platform features.


Post Ad Page

Interface for creating new classified ads, with additional options for premium users.


Affiliate Dashboard

Displays referral statistics, sharing tools, and reward tier information for the affiliate program.


Premium Account Page

Highlights the benefits of premium accounts and provides subscription options.


Technology Stack
• **Frontend**: HTML5, CSS3, JavaScript
• **UI Framework**: Custom CSS with CSS variables for theming
• **Icons**: Font Awesome
• **Fonts**: Google Fonts (Orbitron, Rajdhani)
• **Database**: Schema designed for scalability (implementation ready)


Database Structure

The platform uses a comprehensive database structure to manage:
• User accounts and profiles
• Listing data and metadata
• Affiliate program information
• Analytics and performance metrics


See `db-schema.js` for the complete database schema design.


Design Philosophy

STELLARADS embraces a futuristic aesthetic with:
• Dark backgrounds for reduced eye strain
• Glowing cyan/blue accents for visual interest
• Clean typography with sci-fi inspired fonts
• Subtle animations for a dynamic feel
• Card-based UI components for consistent information display


Getting Started
1. Clone the repository
2. Open `index.html` in your browser to view the platform
3. Navigate through the different pages to explore functionality


Future Enhancements
• User authentication system implementation
• Backend integration for data persistence
• Real-time messaging between buyers and sellers
• Advanced search and filtering capabilities
• Mobile application development


License

This project is licensed under the MIT License - see the LICENSE file for details.
STELLARADS Server

This is the backend server implementation for the STELLARADS platform, a futuristic classified ads marketplace.


Features
• RESTful API for the STELLARADS platform
• User authentication and authorization
• Listing management
• Affiliate program functionality
• Premium account features
• Transaction processing


Prerequisites
• Node.js (v14 or higher)
• MongoDB (v4.4 or higher)
• npm or yarn


Installation
1. Clone the repository
2. Navigate to the server directory:
```
cd src/server
```
3. Install dependencies:
```
npm install
```
or
```
yarn install
```
4. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stellarads
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```


Running the Server

Development Mode

npm run dev

or

yarn dev


This will start the server with nodemon, which automatically restarts the server when changes are detected.


Production Mode

npm start

or

yarn start


API Documentation

See the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file for detailed information about the available endpoints, request/response formats, and authentication requirements.


Database Models

The server uses MongoDB with Mongoose for data modeling. The following models are defined:

• **User**: User accounts and profiles
• **Listing**: Classified ad listings
• **Affiliate**: Affiliate program accounts
• **Referral**: Referral tracking
• **Transaction**: Payment and purchase records


Authentication

The server uses JSON Web Tokens (JWT) for authentication. Most API endpoints require a valid JWT token in the Authorization header:


Authorization: Bearer <your_jwt_token>


Error Handling

The API returns appropriate HTTP status codes and error messages in a consistent format:


{
  "error": "Error message describing the issue"
}


Testing

Run tests with:


npm test

or

yarn test


Deployment

For production deployment, we recommend using Docker and a container orchestration platform like Kubernetes or Docker Swarm.


A sample Dockerfile is provided in the repository.


License

This project is licensed under the MIT License - see the LICENSE file for details.
