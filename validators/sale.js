const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const saleItem = Joi.object({
  productId: objectId.required(),
  qty: Joi.number().positive().required(),
});

const cashSale = Joi.object({
  items: Joi.array().items(saleItem).min(1).required(),
  note: Joi.string().trim().max(500).allow(""),
});

const creditSale = Joi.object({
  customerId: objectId.required(),
  items: Joi.array().items(saleItem).min(1).required(),
  note: Joi.string().trim().max(500).allow(""),
});

const payment = Joi.object({
  customerId: objectId.required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().trim().max(500).allow(""),
});

const listQuery = Joi.object({
  type: Joi.string().valid("cash_sale", "credit_sale", "payment"),
  customerId: objectId,
  date: Joi.string().valid("today"),
});

module.exports = { cashSale, creditSale, payment, listQuery };
