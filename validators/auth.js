const Joi = require("joi");

const register = Joi.object({
  username: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(128).required(),
  cnic: Joi.string().trim().optional(),
});

const login = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const updateProfile = Joi.object({
  username: Joi.string().trim().min(2).max(50),
  email: Joi.string().trim().email(),
  password: Joi.string().min(6).max(128),
}).min(1);

module.exports = { register, login, updateProfile };
