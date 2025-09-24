import express from 'express';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';
import Settlement from '../models/Settlement.js';
import Activity from '../models/Activity.js';
import { auth, groupMemberAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private (Group Member)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, description, amount, currency, category, groupId,
      splitType, splits, receipt, tags, date
    } = req.body;

    if (!title || !amount || !groupId) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, and group are required'
      });
    }

    // Check if user is member of the group
    const group = await Group.findById(groupId);
    if (!group || !group.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this group.'
      });
    }

    const expense = await Expense.create({
      title,
      description,
      amount,
      currency: currency || group.currency,
      category,
      paidBy: req.user._id,
      group: groupId,
      splitType: splitType || 'equal',
      splits,
      receipt,
      tags,
      date: date || new Date()
    });

    // Calculate equal splits if needed
    if (expense.splitType === 'equal' && expense.splits.length > 0) {
      expense.calculateEqualSplit();
      await expense.save();
    }

    // Update group totals
    await Group.findByIdAndUpdate(groupId, {
      $inc: { totalExpenses: amount, expenseCount: 1 }
    });

    // Create activity log
    await Activity.create({
      user: req.user._id,
      group: groupId,
      type: 'expense_added',
      description: `Added expense: ${title}`,
      relatedExpense: expense._id,
      metadata: { amount, currency }
    });

    // Create settlements based on splits
    for (const split of expense.splits) {
      if (split.user.toString() !== req.user._id.toString() && split.amount > 0) {
        await Settlement.create({
          payer: split.user,
          payee: req.user._id,
          amount: split.amount,
          currency: expense.currency,
          group: groupId,
          relatedExpenses: [expense._id]
        });
      }
    }

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name avatar')
      .populate('splits.user', 'name avatar')
      .populate('group', 'name');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/expenses/:groupId
// @desc    Get expenses for a group
// @access  Private (Group Member)
router.get('/:groupId', auth, groupMemberAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, startDate, endDate } = req.query;

    const query = {
      group: req.params.groupId,
      isDeleted: false
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('paidBy', 'name avatar')
      .populate('splits.user', 'name avatar')
      .populate('group', 'name')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        expenses,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/expenses/expense/:expenseId
// @desc    Get single expense
// @access  Private (Group Member)
router.get('/expense/:expenseId', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId)
      .populate('paidBy', 'name avatar email')
      .populate('splits.user', 'name avatar email')
      .populate('group', 'name members');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if user is member of the group
    if (!expense.group.members.some(member => 
      member.user.toString() === req.user._id.toString()
    )) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/expenses/:expenseId
// @desc    Update expense
// @access  Private (Expense Creator or Group Admin)
router.put('/:expenseId', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    const group = await Group.findById(expense.group);
    
    // Check permissions
    if (expense.paidBy.toString() !== req.user._id.toString() && 
        !group.isAdmin(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only expense creator or group admin can update.'
      });
    }

    const { title, description, amount, category, splits, receipt, tags } = req.body;
    
    if (title) expense.title = title;
    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (splits) expense.splits = splits;
    if (receipt) expense.receipt = receipt;
    if (tags) expense.tags = tags;

    // Recalculate splits if needed
    if (expense.splitType === 'equal' && splits) {
      expense.calculateEqualSplit();
    }

    await expense.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      group: expense.group,
      type: 'expense_updated',
      description: `Updated expense: ${expense.title}`,
      relatedExpense: expense._id
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name avatar')
      .populate('splits.user', 'name avatar')
      .populate('group', 'name');

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/expenses/:expenseId
// @desc    Delete expense (soft delete)
// @access  Private (Expense Creator or Group Admin)
router.delete('/:expenseId', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    const group = await Group.findById(expense.group);
    
    // Check permissions
    if (expense.paidBy.toString() !== req.user._id.toString() && 
        !group.isAdmin(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    expense.isDeleted = true;
    await expense.save();

    // Update group totals
    await Group.findByIdAndUpdate(expense.group, {
      $inc: { totalExpenses: -expense.amount, expenseCount: -1 }
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      group: expense.group,
      type: 'expense_deleted',
      description: `Deleted expense: ${expense.title}`,
      relatedExpense: expense._id
    });

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;