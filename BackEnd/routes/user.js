import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('groups');
    
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, avatar, currency, theme } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (currency) updateData.currency = currency;
    if (theme) updateData.theme = theme;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Import models here to avoid circular dependency
    const Group = (await import('../models/Group.js')).default;
    const Expense = (await import('../models/Expense.js')).default;
    const Settlement = (await import('../models/Settlement.js')).default;

    // Get user's groups
    const groups = await Group.find({ 'members.user': req.user._id, isActive: true })
      .populate('members.user', 'name avatar email');

    // Get recent expenses
    const recentExpenses = await Expense.find({
      group: { $in: groups.map(g => g._id) },
      isDeleted: false
    })
      .populate('paidBy', 'name avatar')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get pending settlements
    const pendingSettlements = await Settlement.find({
      $or: [
        { payer: req.user._id },
        { payee: req.user._id }
      ],
      status: 'pending'
    })
      .populate('payer payee', 'name avatar')
      .populate('group', 'name');

    // Calculate totals
    let totalOwed = 0;
    let totalOwes = 0;

    for (const settlement of pendingSettlements) {
      if (settlement.payer.toString() === req.user._id.toString()) {
        totalOwes += settlement.amount;
      } else {
        totalOwed += settlement.amount;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        groups,
        recentExpenses,
        pendingSettlements,
        summary: {
          totalOwed,
          totalOwes,
          netBalance: totalOwed - totalOwes,
          groupCount: groups.length,
          expenseCount: recentExpenses.length
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;