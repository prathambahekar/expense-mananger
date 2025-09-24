import express from 'express';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { auth, groupMemberAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/groups
// @desc    Create a new group
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, currency } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    const group = await Group.create({
      name,
      description,
      currency: currency || req.user.currency,
      createdBy: req.user._id,
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    // Add group to user's groups
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id }
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name avatar email')
      .populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: { group: populatedGroup }
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/groups
// @desc    Get user's groups
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id,
      isActive: true
    })
      .populate('members.user', 'name avatar email')
      .populate('createdBy', 'name avatar')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { groups }
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/groups/:groupId
// @desc    Get group details
// @access  Private (Group Member)
router.get('/:groupId', auth, groupMemberAuth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members.user', 'name avatar email')
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      data: { group }
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/groups/:groupId
// @desc    Update group
// @access  Private (Admin only)
router.put('/:groupId', auth, groupMemberAuth, async (req, res) => {
  try {
    if (!req.group.isAdmin(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only group admins can update group details'
      });
    }

    const { name, description, currency, settings } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (currency) updateData.currency = currency;
    if (settings) updateData.settings = { ...req.group.settings, ...settings };

    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('members.user', 'name avatar email')
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Group updated successfully',
      data: { group }
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/groups/:groupId/join
// @desc    Join group with invite code
// @access  Private
router.post('/:groupId/join', auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        success: false,
        message: 'Invite code is required'
      });
    }

    const group = await Group.findOne({
      _id: req.params.groupId,
      inviteCode,
      isActive: true
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite code or group not found'
      });
    }

    if (group.isMember(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    // Add user to group
    group.addMember(req.user._id);
    await group.save();

    // Add group to user's groups
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id }
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name avatar email')
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Successfully joined the group',
      data: { group: populatedGroup }
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/groups/:groupId/leave
// @desc    Leave group
// @access  Private (Group Member)
router.post('/:groupId/leave', auth, groupMemberAuth, async (req, res) => {
  try {
    const group = req.group;

    // Find and deactivate member
    const memberIndex = group.members.findIndex(
      member => member.user.toString() === req.user._id.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    group.members[memberIndex].isActive = false;
    await group.save();

    // Remove group from user's groups
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { groups: group._id }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully left the group'
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;