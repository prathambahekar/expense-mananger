# CosmicSplit - Complete Setup Guide

A modern expense tracking application with React frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd BackEnd

# Install dependencies
npm install

# Set up environment variables
# Edit the .env file with your MongoDB URI and JWT secrets
# Example MongoDB URI: mongodb://localhost:27017/cosmicsplit
# Generate a strong JWT secret: openssl rand -base64 32

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd FrontEnd

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cosmicsplit
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=30d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CosmicSplit
VITE_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
├── BackEnd/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication & security
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions
│   ├── server.js          # Main server file
│   └── package.json
│
├── FrontEnd/               # React application
│   ├── assets/            # Icons and static files
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── features/          # Feature pages
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Main application pages
│   ├── services/          # API service functions
│   ├── App.tsx            # Main app component
│   └── package.json
```

## 🎯 Features

### Authentication
- User registration and login
- JWT token-based authentication
- Password hashing and security

### Group Management
- Create and join expense groups
- Invite system with codes
- Member management

### Expense Tracking
- Add expenses with multiple split options
- Categorize expenses
- Receipt attachments support
- Edit and delete expenses

### Smart Settlements
- Automatic debt calculation
- Multiple payment methods
- Payment confirmation system
- Settlement history

### Reports & Analytics
- Expense summaries by category
- Monthly spending reports
- Balance tracking
- Data export functionality

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Groups
- `GET /api/groups` - Get user groups
- `POST /api/groups` - Create group
- `POST /api/groups/:id/join` - Join group

### Expenses
- `GET /api/expenses/:groupId` - Get group expenses
- `POST /api/expenses` - Add expense
- `PUT /api/expenses/:id` - Update expense

### Settlements
- `GET /api/settlements/:groupId` - Get settlements
- `POST /api/settlements/:id/mark-paid` - Mark as paid
- `POST /api/settlements/:id/confirm` - Confirm payment

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- CORS configuration
- Input validation and sanitization
- Security headers with Helmet

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - For MongoDB Atlas, whitelist your IP

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set in .env
   - Check token expiration settings
   - Clear browser localStorage if needed

3. **CORS Errors**
   - Verify FRONTEND_URL in backend .env
   - Check if both servers are running
   - Ensure ports match configuration

4. **Build Errors**
   - Delete node_modules and reinstall
   - Check Node.js version compatibility
   - Update TypeScript if needed

### Development Tips

1. **Hot Reloading**
   - Backend: Uses nodemon for auto-restart
   - Frontend: Vite provides instant HMR

2. **Database Seeding**
   - Create test users and groups in MongoDB
   - Use MongoDB Compass for GUI management

3. **API Testing**
   - Use Postman or Thunder Client
   - Check network tab in browser dev tools

## 🚀 Production Deployment

### Backend Deployment
1. Set NODE_ENV=production
2. Use process manager (PM2)
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Configure MongoDB Atlas

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to static hosting (Vercel, Netlify)
3. Update API_URL for production
4. Configure domain and SSL

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request

## 🆘 Support

If you encounter issues:
1. Check this README for troubleshooting
2. Review server and browser console logs
3. Verify environment variable configuration
4. Ensure all dependencies are installed