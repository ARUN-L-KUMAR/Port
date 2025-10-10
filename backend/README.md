# Backend - Node.js/Express

This is the backend server for the portfolio application, built with Node.js and Express.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database

## Project Structure

```
backend/
├── api/                   # API-related functionality
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Data models
│   └── routes/            # API routes
├── config/                # Configuration files
├── docs/                  # Documentation
├── test/                  # Test files
├── utils/                 # Utility functions
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── jest.config.js         # Jest configuration
├── package.json           # Project dependencies and scripts
├── server.js              # Main application file
└── README.md              # This file
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=portfolio_db
   PORT=8000
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 8000 by default.

## API Endpoints

- `GET /api` - Returns a hello world message
- `POST /api/status` - Creates a new status check
- `GET /api/status` - Retrieves all status checks (limited to 1000)
- `GET /api/health` - Returns the health status of the application

## Dependencies

- express: Web framework
- cors: Cross-Origin Resource Sharing middleware
- dotenv: Environment variable loader
- mongodb: MongoDB driver
- uuid: UUID generator
- nodemon (dev): Auto-restart server during development

## Development

The backend follows a modular structure with all API-related functionality grouped in the `api/` directory:
- `api/models/` contains data models
- `api/controllers/` contains request handlers
- `api/routes/` contains route definitions
- `api/middleware/` contains custom middleware

This structure makes the codebase maintainable and scalable.