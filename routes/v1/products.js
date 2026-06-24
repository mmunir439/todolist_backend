const express = require("express");
const productController = require("../../controller/productController");
const { requireAuth } = require("../../middleware/Auth");
const validate = require("../../middleware/validate");
const productValidators = require("../../validators/product");
const asyncHandler = require("../../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth);

router.get("/meta", asyncHandler(productController.getMeta));
router.get("/", validate(productValidators.listQuery, "query"), asyncHandler(productController.list));
router.post("/", validate(productValidators.create), asyncHandler(productController.create));
router.get("/:id", validate(productValidators.productIdParam, "params"), asyncHandler(productController.getOne));
router.patch(
  "/:id",
  validate(productValidators.productIdParam, "params"),
  validate(productValidators.update),
  asyncHandler(productController.update)
);
router.delete("/:id", validate(productValidators.productIdParam, "params"), asyncHandler(productController.remove));

module.exports = router;
