const express = require('express');
const protect = require('../../config/middleware/authMiddleware');
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getCategoryStats,
  getMonthlyStats,
  getFraudStats,
} = require('../controllers/expenseController');

const router = express.Router();

router.use(protect);

router.route('/').get(getExpenses).post(addExpense);
router.route('/:id').put(updateExpense).delete(deleteExpense);
router.get('/stats/categories', getCategoryStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/stats/fraud', getFraudStats);

module.exports = router;