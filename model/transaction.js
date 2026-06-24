const mongoose = require("mongoose");

const TRANSACTION_TYPES = ["cash_sale", "credit_sale", "payment"];

const lineItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 0.01 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: TRANSACTION_TYPES, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
    customerName: { type: String, default: "" },
    items: { type: [lineItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    note: { type: String, trim: true, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, type: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, customerId: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
module.exports.TRANSACTION_TYPES = TRANSACTION_TYPES;
