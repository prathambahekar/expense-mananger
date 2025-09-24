import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token is not valid.'
    });
  }
};

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Check if user is admin (you can add admin field to User schema if needed)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in admin authentication.'
    });
  }
};

// Group member middleware
const groupMemberAuth = async (req, res, next) => {
  try {
    const groupId = req.params.groupId || req.body.groupId;
    
    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required.'
      });
    }

    // Import Group model here to avoid circular dependency
    const Group = (await import('../models/Group.js')).default;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found.'
      });
    }

    // Check if user is a member of the group
    if (!group.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this group.'
      });
    }

    req.group = group;
    next();
  } catch (error) {
    console.error('Group member auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in group authentication.'
    });
  }
};

export { auth, adminAuth, groupMemberAuth };