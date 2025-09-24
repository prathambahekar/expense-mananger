# CosmicSplit Backend

A complete REST API backend for the CosmicSplit expense tracking application built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication (Login/Register)
- 👥 Group Management
- 💰 Expense Tracking
- ⚖️ Smart Settlement System
- 📊 Reports and Analytics
- 🛡️ Security Middleware (Helmet, CORS, Rate Limiting)
- 📝 Activity Logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Helmet, CORS, bcryptjs, Rate Limiting
- **Validation**: Mongoose validation + validator.js

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd BackEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update with your values
   - Key variables to configure:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT signing
     - `PORT`: Server port (default: 5000)

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

5. The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/dashboard` - Get dashboard data

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/:groupId` - Get group details
- `PUT /api/groups/:groupId` - Update group
- `POST /api/groups/:groupId/join` - Join group with invite code
- `POST /api/groups/:groupId/leave` - Leave group

### Expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:groupId` - Get group expenses
- `GET /api/expenses/expense/:expenseId` - Get single expense
- `PUT /api/expenses/:expenseId` - Update expense
- `DELETE /api/expenses/:expenseId` - Delete expense

### Settlements
- `GET /api/settlements/:groupId` - Get group settlements
- `GET /api/settlements/summary/:groupId` - Get settlement summary
- `POST /api/settlements/:settlementId/mark-paid` - Mark settlement as paid
- `POST /api/settlements/:settlementId/confirm` - Confirm settlement
- `POST /api/settlements/request` - Request new settlement
- `DELETE /api/settlements/:settlementId` - Cancel settlement

### Reports
- `GET /api/reports/:groupId/summary` - Get expense summary
- `GET /api/reports/:groupId/balances` - Get balance report
- `GET /api/reports/:groupId/expenses` - Get detailed expense report
- `GET /api/reports/:groupId/export` - Export group data

## Database Models

### User
- Personal information, authentication
- Group memberships
- Balance tracking

### Group
- Group details and settings
- Member management
- Invite system

### Expense
- Expense details and categorization
- Split calculations
- Receipt attachments

### Settlement
- Debt tracking between users
- Payment confirmation system
- Multiple payment methods

### Activity
- System activity logging
- Audit trail for all actions

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on auth endpoints
- Request validation and sanitization
- CORS configuration
- Security headers with Helmet

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Success responses:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `FRONTEND_URL` - Frontend URL for CORS

## Contributing

1. Ensure all environment variables are properly set
2. Test all API endpoints before committing
3. Follow the existing code structure and naming conventions
4. Add proper error handling for new endpoints

## License

MIT