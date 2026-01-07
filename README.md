# AK's Portfolio

This is a fullstack portfolio application built with modern web technologies.

## 🚀 Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js/Express with MongoDB
- **UI Components**: Radix UI, Shadcn UI
- **Build Tool**: CRACO (Create React App Configuration Override)
- **Package Manager**: Yarn
- **Project documentation improved.**

## 📁 Project Structure

```
.
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── data/            # Mock data
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utility functions
│   │   ├── App.js           # Main App component
│   │   ├── index.js         # Entry point
│   │   └── ...              # Other source files
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js/Express backend
│   ├── api/                 # API-related functionality
│   ├── config/              # Configuration files
│   ├── docs/                # API documentation
│   ├── test/                # Test files
│   ├── utils/               # Utility functions
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
└── README.md                # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB database (local or cloud instance)
- Yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   yarn install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../backend
   yarn install
   ```

### Environment Setup

1. **Frontend Environment Variables:**
   Create a `.env` file in the `frontend/` directory:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8000
   WDS_SOCKET_PORT=3000
   ```

2. **Backend Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=portfolio_db
   PORT=8000
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   yarn dev
   ```
   The backend will be available at: http://localhost:8000

2. **Start the frontend application:**
   ```bash
   cd frontend
   yarn start
   ```
   The frontend will be available at: http://localhost:3000

### Running Tests

- **Frontend tests:**
  ```bash
  cd frontend
  yarn test
  ```

- **Backend tests:**
  ```bash
  cd backend
  yarn test
  ```

## 🌐 API Endpoints

- `GET /api` - Root endpoint
- `POST /api/status` - Create a status check
- `GET /api/status` - Retrieve all status checks
- `GET /api/health` - Health check endpoint

## 📦 Key Dependencies

### Frontend
- React.js (v18+)
- Tailwind CSS for styling
- Radix UI and Shadcn UI components
- React Router for navigation
- Framer Motion for animations

### Backend
- Express.js for REST API
- MongoDB for database
- Cors for cross-origin requests
- Dotenv for environment variables
- UUID for unique identifiers

## 📝 Development Notes

- The frontend uses CRACO for custom configuration
- The backend follows a modular structure with dedicated API folder
- Both frontend and backend use ESLint for code quality
- Environment variables are used for configuration

## 🚀 Deployment

### Frontend
Build the frontend for production:
```bash
cd frontend
yarn build
```

### Backend
Start the backend in production mode:
```bash
cd backend
yarn start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.