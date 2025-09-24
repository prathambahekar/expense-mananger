const Expense = require('../models/Expense');
const detectFraud = require('../utils/fraudDetector');

const getExpenses = async (req, res) => {
  try {
    const { includeRisk } = req.query;
    let query = { userId: req.user.id };
    const expenses = await Expense.find(query).sort({ date: -1 }).populate('userId', 'email');
    
    if (includeRisk === 'true' && expenses.length > 0) {
      for (let exp of expenses.filter(e => e.riskScore === 0)) {
        const fraudResult = await detectFraud({
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          date: exp.date,
          userId: exp.userId._id,
        });
        exp.isFraudulent = fraudResult.isFraudulent;
        exp.riskScore = fraudResult.riskScore;
        await exp.save();
      }
    }
    
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addExpense = async (req, res) => {
  const { description, amount, category, date } = req.body;
  try {
    if (!description || !amount || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const fraudResult = await detectFraud({ description, amount, category, date, userId: req.user.id });
    
    const expense = new Expense({ 
      userId: req.user.id, 
      description, 
      amount, 
      category, 
      date,
      isFraudulent: fraudResult.isFraudulent,
      riskScore: fraudResult.riskScore,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findOne({ _id: id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    Object.assign(expense, req.body);
    
    if (req.body.amount || req.body.category || req.body.date) {
      const fraudResult = await detectFraud({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        userId: req.user.id,
      });
      expense.isFraudulent = fraudResult.isFraudulent;
      expense.riskScore = fraudResult.riskScore;
    }
    
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFraudStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$isFraudulent',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getCategoryStats,
  getMonthlyStats,
  getFraudStats,
};