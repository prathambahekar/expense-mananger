import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Settlement amount must be greater than 0']
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD']
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  relatedExpenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  method: {
    type: String,
    enum: ['cash', 'bank_transfer', 'paypal', 'venmo', 'other'],
    default: 'cash'
  },
  note: {
    type: String,
    trim: true,
    maxlength: [200, 'Note cannot be more than 200 characters']
  },
  settledAt: {
    type: Date
  },
  confirmedBy: {
    payer: {
      type: Boolean,
      default: false
    },
    payee: {
      type: Boolean,
      default: false
    }
  },
  proof: {
    type: String // URL to proof of payment (receipt, screenshot, etc.)
  }
}, {
  timestamps: true
});

// Index for better query performance
settlementSchema.index({ payer: 1, status: 1 });
settlementSchema.index({ payee: 1, status: 1 });
settlementSchema.index({ group: 1, status: 1 });

// Method to mark settlement as completed
settlementSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.settledAt = new Date();
};

// Method to check if settlement is confirmed by both parties
settlementSchema.methods.isBothConfirmed = function() {
  return this.confirmedBy.payer && this.confirmedBy.payee;
};

export default mongoose.model('Settlement', settlementSchema);