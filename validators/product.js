const Joi = require("joi");
const { CATEGORIES, UNITS } = require("../model/product");

const objectId = Joi.string().hex().length(24);

const create = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  category: Joi.string().valid(...CATEGORIES),
  buyPrice: Joi.number().min(0),
  sellPrice: Joi.number().min(0).required(),
  stock: Joi.number().min(0),
  unit: Joi.string().valid(...UNITS),
  lowStockAlert: Joi.number().min(0),
});

const update = Joi.object({
  name: Joi.string().trim().min(1).max(200),
  category: Joi.string().valid(...CATEGORIES),
  buyPrice: Joi.number().min(0),
  sellPrice: Joi.number().min(0),
  stock: Joi.number().min(0),
  unit: Joi.string().valid(...UNITS),
  lowStockAlert: Joi.number().min(0),
}).min(1);

const listQuery = Joi.object({
  category: Joi.string().valid(...CATEGORIES),
  q: Joi.string().trim().max(200),
  lowStock: Joi.boolean(),
});

const productIdParam = Joi.object({
  id: objectId.required(),
});

module.exports = { create, update, listQuery, productIdParam };
