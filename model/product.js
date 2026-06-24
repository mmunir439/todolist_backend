const mongoose = require("mongoose");

const CATEGORIES = ["lighting", "wiring", "mobile", "tv_audio", "fan", "other"];
const UNITS = ["piece", "meter", "dozen"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, enum: CATEGORIES, default: "other" },
    buyPrice: { type: Number, default: 0, min: 0 },
    sellPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, enum: UNITS, default: "piece" },
    lowStockAlert: { type: Number, default: 5, min: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

productSchema.index({ userId: 1, name: 1 });
productSchema.index({ userId: 1, category: 1 });
productSchema.index({ userId: 1, stock: 1 });

productSchema.virtual("isLowStock").get(function () {
  return this.stock <= this.lowStockAlert;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.UNITS = UNITS;
