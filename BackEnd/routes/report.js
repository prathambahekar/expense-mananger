import express from 'express';
import Expense from '../models/Expense.js';
import Settlement from '../models/Settlement.js';
import { auth, groupMemberAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/:groupId/summary
// @desc    Get group expense summary
// @access  Private (Group Member)
router.get('/:groupId/summary', auth, groupMemberAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const groupId = req.params.groupId;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get expenses
    const expenses = await Expense.find({
      group: groupId,
      isDeleted: false,
      ...dateFilter
    })
      .populate('paidBy', 'name avatar')
      .populate('splits.user', 'name avatar');

    // Calculate summary statistics
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = expenses.length;

    // Category breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    // Monthly breakdown
    const monthlyBreakdown = expenses.reduce((acc, expense) => {
      const month = expense.date.toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    // User breakdown (who paid what)
    const userBreakdown = expenses.reduce((acc, expense) => {
      const userId = expense.paidBy._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: expense.paidBy,
          totalPaid: 0,
          expenseCount: 0
        };
      }
      acc[userId].totalPaid += expense.amount;
      acc[userId].expenseCount += 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalAmount,
          expenseCount,
          averageExpense: expenseCount > 0 ? totalAmount / expenseCount : 0
        },
        categoryBreakdown,
        monthlyBreakdown,
        userBreakdown: Object.values(userBreakdown)
      }
    });
  } catch (error) {
    console.error('Get report summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reports/:groupId/balances
// @desc    Get group balance report
// @access  Private (Group Member)
router.get('/:groupId/balances', auth, groupMemberAuth, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Get all pending settlements
    const settlements = await Settlement.find({
      group: groupId,
      status: 'pending'
    })
      .populate('payer payee', 'name avatar email');

    // Calculate net balances for each user
    const balances = new Map();
    
    settlements.forEach(settlement => {
      const payerId = settlement.payer._id.toString();
      const payeeId = settlement.payee._id.toString();

      // Initialize balance objects if they don't exist
      if (!balances.has(payerId)) {
        balances.set(payerId, {
          user: settlement.payer,
          totalOwes: 0,
          totalOwed: 0,
          netBalance: 0,
          transactions: []
        });
      }

      if (!balances.has(payeeId)) {
        balances.set(payeeId, {
          user: settlement.payee,
          totalOwes: 0,
          totalOwed: 0,
          netBalance: 0,
          transactions: []
        });
      }

      // Update balances
      const payerBalance = balances.get(payerId);
      const payeeBalance = balances.get(payeeId);

      payerBalance.totalOwes += settlement.amount;
      payeeBalance.totalOwed += settlement.amount;

      // Add transaction details
      payerBalance.transactions.push({
        type: 'owes',
        counterparty: settlement.payee,
        amount: settlement.amount,
        currency: settlement.currency,
        settlementId: settlement._id
      });

      payeeBalance.transactions.push({
        type: 'owed',
        counterparty: settlement.payer,
        amount: settlement.amount,
        currency: settlement.currency,
        settlementId: settlement._id
      });
    });

    // Calculate net balances
    balances.forEach(balance => {
      balance.netBalance = balance.totalOwed - balance.totalOwes;
    });

    // Convert to array and sort by net balance (highest creditors first)
    const balanceReport = Array.from(balances.values())
      .sort((a, b) => b.netBalance - a.netBalance);

    res.status(200).json({
      success: true,
      data: {
        balances: balanceReport,
        summary: {
          totalOutstanding: settlements.reduce((sum, s) => sum + s.amount, 0),
          settlementCount: settlements.length
        }
      }
    });
  } catch (error) {
    console.error('Get balance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reports/:groupId/expenses
// @desc    Get detailed expense report
// @access  Private (Group Member)
router.get('/:groupId/expenses', auth, groupMemberAuth, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      category, 
      paidBy,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    const query = {
      group: req.params.groupId,
      isDeleted: false
    };

    // Apply filters
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (paidBy) {
      query.paidBy = paidBy;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const expenses = await Expense.find(query)
      .populate('paidBy', 'name avatar email')
      .populate('splits.user', 'name avatar email')
      .populate('group', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        expenses,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get expense report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/reports/:groupId/export
// @desc    Export group data
// @access  Private (Group Member)
router.get('/:groupId/export', auth, groupMemberAuth, async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    const groupId = req.params.groupId;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get all expenses
    const expenses = await Expense.find({
      group: groupId,
      isDeleted: false,
      ...dateFilter
    })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 });

    // Get all settlements
    const settlements = await Settlement.find({
      group: groupId,
      ...dateFilter
    })
      .populate('payer payee', 'name email')
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    const exportData = {
      group: req.group.name,
      exportDate: new Date().toISOString(),
      dateRange: { startDate, endDate },
      expenses: expenses.map(expense => ({
        id: expense._id,
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency,
        category: expense.category,
        paidBy: expense.paidBy.name,
        date: expense.date,
        splits: expense.splits.map(split => ({
          user: split.user.name,
          amount: split.amount,
          settled: split.settled
        }))
      })),
      settlements: settlements.map(settlement => ({
        id: settlement._id,
        payer: settlement.payer.name,
        payee: settlement.payee.name,
        amount: settlement.amount,
        currency: settlement.currency,
        status: settlement.status,
        method: settlement.method,
        date: settlement.createdAt,
        settledAt: settlement.settledAt
      })),
      summary: {
        totalExpenses: expenses.length,
        totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
        totalSettlements: settlements.length,
        pendingSettlements: settlements.filter(s => s.status === 'pending').length
      }
    };

    if (format === 'csv') {
      // Simple CSV format for expenses
      const csvHeader = 'Date,Title,Amount,Currency,Category,Paid By,Description\n';
      const csvData = expenses.map(expense => 
        `${expense.date.toISOString().split('T')[0]},${expense.title},${expense.amount},${expense.currency},${expense.category},${expense.paidBy.name},"${expense.description || ''}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${req.group.name}_expenses.csv"`);
      res.send(csvHeader + csvData);
    } else {
      res.status(200).json({
        success: true,
        data: exportData
      });
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;