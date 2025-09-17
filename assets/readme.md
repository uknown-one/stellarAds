# STELLARADS Server
 
This is the backend server implementation for the STELLARADS platform, a futuristic classified ads marketplace.
 
## Features
 
- RESTful API for the STELLARADS platform
- User authentication and authorization
- Listing management
- Affiliate program functionality
- Premium account features
- Transaction processing
 
## Prerequisites
 
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
 
## Installation
 
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
 
## Running the Server
 
### Development Mode
 
```
npm run dev
```
or
```
yarn dev
```
 
This will start the server with nodemon, which automatically restarts the server when changes are detected.
 
### Production Mode
 
```
npm start
```
or
```
yarn start
```
 
## API Documentation
 
See the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file for detailed information about the available endpoints, request/response formats, and authentication requirements.
 
## Database Models
 
The server uses MongoDB with Mongoose for data modeling. The following models are defined:
 
- **User**: User accounts and profiles
- **Listing**: Classified ad listings
- **Affiliate**: Affiliate program accounts
- **Referral**: Referral tracking
- **Transaction**: Payment and purchase records
 
## Authentication
 
The server uses JSON Web Tokens (JWT) for authentication. Most API endpoints require a valid JWT token in the Authorization header:
 
```
Authorization: Bearer <your_jwt_token>
```
 
## Error Handling
 
The API returns appropriate HTTP status codes and error messages in a consistent format:
 
```json
{
  "error": "Error message describing the issue"
}
```
 
## Testing
 
Run tests with:
 
```
npm test
```
or
```
yarn test
```
 
## Deployment
 
For production deployment, we recommend using Docker and a container orchestration platform like Kubernetes or Docker Swarm.
 
A sample Dockerfile is provided in the repository.
 
## License
 
This project is licensed under the MIT License - see the LICENSE file for details.
 
File created successfully
