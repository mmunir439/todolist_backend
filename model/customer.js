const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    address: { type: String, trim: true, default: "" },
    balance: { type: Number, default: 0, min: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

customerSchema.index({ userId: 1, phone: 1 }, { unique: true });
customerSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model("Customer", customerSchema);
