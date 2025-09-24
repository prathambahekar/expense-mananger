import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'food', 'transport', 'entertainment', 'utilities', 
      'shopping', 'healthcare', 'education', 'travel', 
      'groceries', 'rent', 'other'
    ]
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  splitType: {
    type: String,
    enum: ['equal', 'exact', 'percentage'],
    default: 'equal'
  },
  splits: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    settled: {
      type: Boolean,
      default: false
    }
  }],
  receipt: {
    type: String // URL to uploaded receipt image
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
expenseSchema.index({ group: 1, date: -1 });
expenseSchema.index({ paidBy: 1, date: -1 });
expenseSchema.index({ 'splits.user': 1 });

// Calculate split amounts for equal split
expenseSchema.methods.calculateEqualSplit = function() {
  if (this.splitType === 'equal' && this.splits.length > 0) {
    const splitAmount = this.amount / this.splits.length;
    this.splits.forEach(split => {
      split.amount = splitAmount;
    });
  }
};

export default mongoose.model('Expense', expenseSchema);