const Customer = require("../model/customer");
const Transaction = require("../model/transaction");
const AppError = require("../utils/AppError");

exports.list = async (userId, query = {}) => {
  const filter = { userId };

  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { phone: { $regex: query.q, $options: "i" } },
    ];
  }
  if (query.hasBalance) filter.balance = { $gt: 0 };

  return Customer.find(filter).sort({ balance: -1, name: 1 });
};

exports.getOne = async (userId, customerId) => {
  const customer = await Customer.findOne({ _id: customerId, userId });
  if (!customer) throw new AppError("Customer not found", 404);
  return customer;
};

exports.create = async (userId, data) => {
  const existing = await Customer.findOne({ userId, phone: data.phone });
  if (existing) throw new AppError("Customer with this phone already exists", 409);
  return Customer.create({ ...data, userId });
};

exports.update = async (userId, customerId, data) => {
  if (data.phone) {
    const existing = await Customer.findOne({
      userId,
      phone: data.phone,
      _id: { $ne: customerId },
    });
    if (existing) throw new AppError("Customer with this phone already exists", 409);
  }

  const customer = await Customer.findOneAndUpdate({ _id: customerId, userId }, data, {
    new: true,
    runValidators: true,
  });
  if (!customer) throw new AppError("Customer not found", 404);
  return customer;
};

exports.remove = async (userId, customerId) => {
  const customer = await Customer.findOne({ _id: customerId, userId });
  if (!customer) throw new AppError("Customer not found", 404);
  if (customer.balance > 0) {
    throw new AppError("Cannot delete customer with pending balance. Collect payment first.", 400);
  }

  await Customer.findOneAndDelete({ _id: customerId, userId });
};

exports.getTransactions = async (userId, customerId) => {
  await exports.getOne(userId, customerId);
  return Transaction.find({ userId, customerId }).sort({ createdAt: -1 });
};
