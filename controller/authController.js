const authService = require("../services/authService");
const { sendSuccess } = require("../utils/apiResponse");

exports.register = async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 201);
};

exports.login = async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, result);
};

exports.getMe = async (req, res) => {
  const user = await authService.getProfile(req.user.userId);
  sendSuccess(res, user);
};

exports.updateMe = async (req, res) => {
  const user = await authService.updateProfile(req.user.userId, req.body);
  sendSuccess(res, user);
};

exports.deleteMe = async (req, res) => {
  await authService.deleteAccount(req.user.userId);
  sendSuccess(res, { message: "Account deleted successfully" });
};
