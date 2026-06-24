const Joi = require("joi");

const register = Joi.object({
  username: Joi.string().trim().min(2).max(50).required(),
  shopName: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const login = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const updateProfile = Joi.object({
  username: Joi.string().trim().min(2).max(50),
  shopName: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().email(),
  password: Joi.string().min(6).max(128),
}).min(1);

module.exports = { register, login, updateProfile };
