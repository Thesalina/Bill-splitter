const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: { type: String },
  amount: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
}, { timestamps: true });

ExpenseSchema.index({ groupId: 1 });
ExpenseSchema.index({ paidBy: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);