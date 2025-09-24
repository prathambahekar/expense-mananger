import express from 'express';
import Settlement from '../models/Settlement.js';
import Group from '../models/Group.js';
import Activity from '../models/Activity.js';
import { auth, groupMemberAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settlements/:groupId
// @desc    Get settlements for a group
// @access  Private (Group Member)
router.get('/:groupId', auth, groupMemberAuth, async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    const query = {
      group: req.params.groupId,
      $or: [
        { payer: req.user._id },
        { payee: req.user._id }
      ]
    };

    if (status !== 'all') {
      query.status = status;
    }

    const settlements = await Settlement.find(query)
      .populate('payer payee', 'name avatar email')
      .populate('group', 'name')
      .populate('relatedExpenses', 'title amount date')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { settlements }
    });
  } catch (error) {
    console.error('Get settlements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/settlements/summary/:groupId
// @desc    Get settlement summary for a group
// @access  Private (Group Member)
router.get('/summary/:groupId', auth, groupMemberAuth, async (req, res) => {
  try {
    const settlements = await Settlement.find({
      group: req.params.groupId,
      status: 'pending'
    })
      .populate('payer payee', 'name avatar email');

    // Calculate balances
    const balances = new Map();
    
    settlements.forEach(settlement => {
      const payerId = settlement.payer._id.toString();
      const payeeId = settlement.payee._id.toString();

      if (!balances.has(payerId)) {
        balances.set(payerId, {
          user: settlement.payer,
          owes: 0,
          owed: 0,
          net: 0
        });
      }

      if (!balances.has(payeeId)) {
        balances.set(payeeId, {
          user: settlement.payee,
          owes: 0,
          owed: 0,
          net: 0
        });
      }

      balances.get(payerId).owes += settlement.amount;
      balances.get(payeeId).owed += settlement.amount;
    });

    // Calculate net balances
    balances.forEach(balance => {
      balance.net = balance.owed - balance.owes;
    });

    // Convert to array and sort by net balance
    const balanceArray = Array.from(balances.values())
      .sort((a, b) => b.net - a.net);

    res.status(200).json({
      success: true,
      data: { 
        balances: balanceArray,
        totalSettlements: settlements.length,
        totalAmount: settlements.reduce((sum, s) => sum + s.amount, 0)
      }
    });
  } catch (error) {
    console.error('Get settlement summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/settlements/:settlementId/mark-paid
// @desc    Mark settlement as paid
// @access  Private (Payer)
router.post('/:settlementId/mark-paid', auth, async (req, res) => {
  try {
    const { method, note, proof } = req.body;

    const settlement = await Settlement.findById(req.params.settlementId)
      .populate('payer payee', 'name avatar email')
      .populate('group', 'name');

    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: 'Settlement not found'
      });
    }

    // Check if user is the payer
    if (settlement.payer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the payer can mark settlement as paid'
      });
    }

    if (settlement.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Settlement is not pending'
      });
    }

    // Update settlement
    settlement.status = 'completed';
    settlement.settledAt = new Date();
    settlement.confirmedBy.payer = true;
    if (method) settlement.method = method;
    if (note) settlement.note = note;
    if (proof) settlement.proof = proof;

    await settlement.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      group: settlement.group._id,
      type: 'settlement_completed',
      description: `Marked settlement as paid to ${settlement.payee.name}`,
      relatedSettlement: settlement._id,
      metadata: { amount: settlement.amount, currency: settlement.currency }
    });

    res.status(200).json({
      success: true,
      message: 'Settlement marked as paid successfully',
      data: { settlement }
    });
  } catch (error) {
    console.error('Mark paid error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/settlements/:settlementId/confirm
// @desc    Confirm settlement receipt
// @access  Private (Payee)
router.post('/:settlementId/confirm', auth, async (req, res) => {
  try {
    const settlement = await Settlement.findById(req.params.settlementId)
      .populate('payer payee', 'name avatar email')
      .populate('group', 'name');

    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: 'Settlement not found'
      });
    }

    // Check if user is the payee
    if (settlement.payee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the payee can confirm settlement'
      });
    }

    settlement.confirmedBy.payee = true;
    await settlement.save();

    res.status(200).json({
      success: true,
      message: 'Settlement confirmed successfully',
      data: { settlement }
    });
  } catch (error) {
    console.error('Confirm settlement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/settlements/request
// @desc    Request a new settlement
// @access  Private (Group Member)
router.post('/request', auth, async (req, res) => {
  try {
    const { payerId, amount, currency, groupId, note } = req.body;

    if (!payerId || !amount || !groupId) {
      return res.status(400).json({
        success: false,
        message: 'Payer, amount, and group are required'
      });
    }

    // Check if user is member of the group
    const group = await Group.findById(groupId);
    if (!group || !group.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const settlement = await Settlement.create({
      payer: payerId,
      payee: req.user._id,
      amount,
      currency: currency || group.currency,
      group: groupId,
      note
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      group: groupId,
      type: 'settlement_requested',
      description: `Requested settlement from user`,
      relatedSettlement: settlement._id,
      relatedUser: payerId,
      metadata: { amount, currency }
    });

    const populatedSettlement = await Settlement.findById(settlement._id)
      .populate('payer payee', 'name avatar email')
      .populate('group', 'name');

    res.status(201).json({
      success: true,
      message: 'Settlement requested successfully',
      data: { settlement: populatedSettlement }
    });
  } catch (error) {
    console.error('Request settlement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/settlements/:settlementId
// @desc    Cancel settlement
// @access  Private (Payer or Payee)
router.delete('/:settlementId', auth, async (req, res) => {
  try {
    const settlement = await Settlement.findById(req.params.settlementId);

    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: 'Settlement not found'
      });
    }

    // Check if user is involved in the settlement
    if (settlement.payer.toString() !== req.user._id.toString() && 
        settlement.payee.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (settlement.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending settlements'
      });
    }

    settlement.status = 'cancelled';
    await settlement.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      group: settlement.group,
      type: 'settlement_cancelled',
      description: 'Cancelled settlement',
      relatedSettlement: settlement._id
    });

    res.status(200).json({
      success: true,
      message: 'Settlement cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel settlement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;