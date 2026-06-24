const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const create = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  phone: Joi.string().trim().min(7).max(20).required(),
  address: Joi.string().trim().max(300).allow(""),
});

const update = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  phone: Joi.string().trim().min(7).max(20),
  address: Joi.string().trim().max(300).allow(""),
}).min(1);

const listQuery = Joi.object({
  q: Joi.string().trim().max(200),
  hasBalance: Joi.boolean(),
});

const customerIdParam = Joi.object({
  id: objectId.required(),
});

module.exports = { create, update, listQuery, customerIdParam };
