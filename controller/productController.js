const productService = require("../services/productService");
const { sendSuccess } = require("../utils/apiResponse");

exports.list = async (req, res) => {
  const products = await productService.list(req.user.userId, req.query);
  sendSuccess(res, products);
};

exports.getMeta = async (req, res) => {
  sendSuccess(res, {
    categories: productService.getCategories(),
    units: productService.getUnits(),
  });
};

exports.getOne = async (req, res) => {
  const product = await productService.getOne(req.user.userId, req.params.id);
  sendSuccess(res, product);
};

exports.create = async (req, res) => {
  const product = await productService.create(req.user.userId, req.body);
  sendSuccess(res, product, 201);
};

exports.update = async (req, res) => {
  const product = await productService.update(req.user.userId, req.params.id, req.body);
  sendSuccess(res, product);
};

exports.remove = async (req, res) => {
  await productService.remove(req.user.userId, req.params.id);
  sendSuccess(res, { message: "Product deleted successfully" });
};
