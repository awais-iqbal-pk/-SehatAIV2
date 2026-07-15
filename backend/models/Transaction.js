const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'PKR' },
  method: { type: String, enum: ['easypaisa', 'jazzcash', 'stripe', 'bank', 'crypto'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  couponUsed: String,
  discountAmount: { type: Number, default: 0 },
  invoiceNumber: { type: String, unique: true },
  paymentDetails: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
