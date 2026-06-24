const { sendError } = require("../utils/apiResponse");

module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return sendError(res, err.message, 422);
  }

  if (err.name === "CastError") {
    return sendError(res, "Invalid ID format", 400);
  }

  if (err.code === 11000) {
    return sendError(res, "Duplicate field value", 409);
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  if (!err.isOperational) {
    console.error(err);
  }

  return sendError(res, message, statusCode);
};
