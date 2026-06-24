const { sendError } = require("../utils/apiResponse");

module.exports = (schema, source = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join("."),
      message: d.message,
    }));
    return sendError(res, "Validation failed", 422, errors);
  }

  req[source] = value;
  next();
};
