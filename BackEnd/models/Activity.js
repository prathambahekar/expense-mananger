import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  type: {
    type: String,
    enum: [
      'expense_added', 'expense_updated', 'expense_deleted',
      'settlement_requested', 'settlement_completed', 'settlement_cancelled',
      'member_added', 'member_removed', 'group_created', 'group_updated'
    ],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  relatedExpense: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  },
  relatedSettlement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Settlement'
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for better query performance
activitySchema.index({ group: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);