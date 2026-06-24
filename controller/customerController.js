const customerService = require("../services/customerService");
const { sendSuccess } = require("../utils/apiResponse");

exports.list = async (req, res) => {
  const customers = await customerService.list(req.user.userId, req.query);
  sendSuccess(res, customers);
};

exports.getOne = async (req, res) => {
  const customer = await customerService.getOne(req.user.userId, req.params.id);
  sendSuccess(res, customer);
};

exports.create = async (req, res) => {
  const customer = await customerService.create(req.user.userId, req.body);
  sendSuccess(res, customer, 201);
};

exports.update = async (req, res) => {
  const customer = await customerService.update(req.user.userId, req.params.id, req.body);
  sendSuccess(res, customer);
};

exports.remove = async (req, res) => {
  await customerService.remove(req.user.userId, req.params.id);
  sendSuccess(res, { message: "Customer deleted successfully" });
};

exports.getTransactions = async (req, res) => {
  const transactions = await customerService.getTransactions(req.user.userId, req.params.id);
  sendSuccess(res, transactions);
};
