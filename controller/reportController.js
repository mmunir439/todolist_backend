const reportService = require("../services/reportService");
const { sendSuccess } = require("../utils/apiResponse");

exports.dashboard = async (req, res) => {
  const data = await reportService.getDashboard(req.user.userId);
  sendSuccess(res, data);
};

exports.daily = async (req, res) => {
  const data = await reportService.getDailyReport(req.user.userId);
  sendSuccess(res, data);
};
