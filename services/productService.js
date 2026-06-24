const Product = require("../model/product");
const AppError = require("../utils/AppError");

exports.list = async (userId, query = {}) => {
  const filter = { userId };

  if (query.category) filter.category = query.category;
  if (query.q) filter.name = { $regex: query.q, $options: "i" };
  if (query.lowStock) {
    filter.$expr = { $lte: ["$stock", "$lowStockAlert"] };
  }

  return Product.find(filter).sort({ name: 1 });
};

exports.getOne = async (userId, productId) => {
  const product = await Product.findOne({ _id: productId, userId });
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

exports.create = async (userId, data) => {
  return Product.create({ ...data, userId });
};

exports.update = async (userId, productId, data) => {
  const product = await Product.findOneAndUpdate({ _id: productId, userId }, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

exports.remove = async (userId, productId) => {
  const product = await Product.findOneAndDelete({ _id: productId, userId });
  if (!product) throw new AppError("Product not found", 404);
};

exports.getCategories = () => Product.CATEGORIES;

exports.getUnits = () => Product.UNITS;
