const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const create = Joi.object({
  title: Joi.string().trim().min(1).max(500).required(),
  description: Joi.string().trim().max(5000).allow(""),
  status: Joi.string().valid("todo", "done"),
  dueDate: Joi.date().iso().allow(null),
});

const update = Joi.object({
  title: Joi.string().trim().min(1).max(500),
  description: Joi.string().trim().max(5000).allow(""),
  status: Joi.string().valid("todo", "done"),
  dueDate: Joi.date().iso().allow(null),
}).min(1);

const listQuery = Joi.object({
  status: Joi.string().valid("todo", "done"),
  due: Joi.string().valid("today", "upcoming", "overdue"),
});

const taskIdParam = Joi.object({
  id: objectId.required(),
});

module.exports = { create, update, listQuery, taskIdParam };
