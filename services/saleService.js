const Product = require("../model/product");
const Customer = require("../model/customer");
const Transaction = require("../model/transaction");
const AppError = require("../utils/AppError");

const buildLineItems = async (userId, items) => {
  const lineItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findOne({ _id: item.productId, userId });
    if (!product) throw new AppError(`Product not found: ${item.productId}`, 404);
    if (product.stock < item.qty) {
      throw new AppError(`Not enough stock for "${product.name}". Available: ${product.stock}`, 400);
    }

    const total = Math.round(product.sellPrice * item.qty * 100) / 100;
    lineItems.push({
      productId: product._id,
      name: product.name,
      qty: item.qty,
      unitPrice: product.sellPrice,
      total,
    });
    totalAmount += total;
  }

  return { lineItems, totalAmount: Math.round(totalAmount * 100) / 100 };
};

const reduceStock = async (userId, lineItems) => {
  for (const item of lineItems) {
    const product = await Product.findOneAndUpdate(
      { _id: item.productId, userId, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } },
      { new: true }
    );
    if (!product) {
      throw new AppError(`Failed to update stock for "${item.name}"`, 400);
    }
  }
};

exports.cashSale = async (userId, { items, note }) => {
  const { lineItems, totalAmount } = await buildLineItems(userId, items);
  await reduceStock(userId, lineItems);

  return Transaction.create({
    type: "cash_sale",
    items: lineItems,
    totalAmount,
    paidAmount: totalAmount,
    note: note || "",
    userId,
  });
};

exports.creditSale = async (userId, { customerId, items, note }) => {
  const customer = await Customer.findOne({ _id: customerId, userId });
  if (!customer) throw new AppError("Customer not found", 404);

  const { lineItems, totalAmount } = await buildLineItems(userId, items);
  await reduceStock(userId, lineItems);

  customer.balance = Math.round((customer.balance + totalAmount) * 100) / 100;
  await customer.save();

  return Transaction.create({
    type: "credit_sale",
    customerId: customer._id,
    customerName: customer.name,
    items: lineItems,
    totalAmount,
    paidAmount: 0,
    note: note || "",
    userId,
  });
};

exports.recordPayment = async (userId, { customerId, amount, note }) => {
  const customer = await Customer.findOne({ _id: customerId, userId });
  if (!customer) throw new AppError("Customer not found", 404);
  if (customer.balance <= 0) throw new AppError("Customer has no pending balance", 400);
  if (amount > customer.balance) {
    throw new AppError(`Payment exceeds balance. Customer owes: ${customer.balance}`, 400);
  }

  customer.balance = Math.round((customer.balance - amount) * 100) / 100;
  await customer.save();

  return Transaction.create({
    type: "payment",
    customerId: customer._id,
    customerName: customer.name,
    items: [],
    totalAmount: amount,
    paidAmount: amount,
    note: note || "",
    userId,
  });
};

exports.listTransactions = async (userId, query = {}) => {
  const filter = { userId };

  if (query.type) filter.type = query.type;
  if (query.customerId) filter.customerId = query.customerId;

  if (query.date === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  return Transaction.find(filter).sort({ createdAt: -1 });
};
