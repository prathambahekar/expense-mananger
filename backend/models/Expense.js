const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isFraudulent: { type: Boolean, default: false },
  riskScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);