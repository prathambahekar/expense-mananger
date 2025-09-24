// backend/config/middleware/authMiddleware.js
module.exports = (req, res, next) => {
  console.log('Auth middleware called');
  next();
};
