const saleService = require("../services/saleService");
const { sendSuccess } = require("../utils/apiResponse");

exports.cashSale = async (req, res) => {
  const transaction = await saleService.cashSale(req.user.userId, req.body);
  sendSuccess(res, transaction, 201);
};

exports.creditSale = async (req, res) => {
  const transaction = await saleService.creditSale(req.user.userId, req.body);
  sendSuccess(res, transaction, 201);
};

exports.payment = async (req, res) => {
  const transaction = await saleService.recordPayment(req.user.userId, req.body);
  sendSuccess(res, transaction, 201);
};

exports.list = async (req, res) => {
  const transactions = await saleService.listTransactions(req.user.userId, req.query);
  sendSuccess(res, transactions);
};
