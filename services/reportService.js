const mongoose = require("mongoose");
const Product = require("../model/product");
const Customer = require("../model/customer");
const Transaction = require("../model/transaction");

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

exports.getDashboard = async (userId) => {
  const { start, end } = getTodayRange();
  const ownerId = new mongoose.Types.ObjectId(userId);

  const [todayTransactions, totalUdhar, lowStockProducts, productCount, customerCount] =
    await Promise.all([
      Transaction.find({ userId: ownerId, createdAt: { $gte: start, $lte: end } }),
      Customer.aggregate([
        { $match: { userId: ownerId } },
        { $group: { _id: null, total: { $sum: "$balance" } } },
      ]),
      Product.find({ userId: ownerId, $expr: { $lte: ["$stock", "$lowStockAlert"] } })
        .sort({ stock: 1 })
        .limit(10),
      Product.countDocuments({ userId: ownerId }),
      Customer.countDocuments({ userId: ownerId }),
    ]);

  let todayCashSales = 0;
  let todayCreditSales = 0;
  let todayPayments = 0;

  for (const tx of todayTransactions) {
    if (tx.type === "cash_sale") todayCashSales += tx.totalAmount;
    if (tx.type === "credit_sale") todayCreditSales += tx.totalAmount;
    if (tx.type === "payment") todayPayments += tx.paidAmount;
  }

  const customersWithBalance = await Customer.countDocuments({ userId: ownerId, balance: { $gt: 0 } });
  const recentTransactions = await Transaction.find({ userId: ownerId })
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    shopSummary: {
      totalProducts: productCount,
      totalCustomers: customerCount,
      customersWithBalance,
      totalUdharPending: totalUdhar[0]?.total || 0,
    },
    today: {
      cashSales: todayCashSales,
      creditSales: todayCreditSales,
      paymentsReceived: todayPayments,
      netCashIn: todayCashSales + todayPayments,
    },
    lowStockProducts,
    recentTransactions,
  };
};

exports.getDailyReport = async (userId) => {
  const { start, end } = getTodayRange();
  const transactions = await Transaction.find({
    userId,
    createdAt: { $gte: start, $lte: end },
  }).sort({ createdAt: -1 });

  const summary = { cashSales: 0, creditSales: 0, paymentsReceived: 0, transactionCount: transactions.length };

  for (const tx of transactions) {
    if (tx.type === "cash_sale") summary.cashSales += tx.totalAmount;
    if (tx.type === "credit_sale") summary.creditSales += tx.totalAmount;
    if (tx.type === "payment") summary.paymentsReceived += tx.paidAmount;
  }

  return { summary, transactions };
};
