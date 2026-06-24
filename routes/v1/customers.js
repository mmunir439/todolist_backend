const express = require("express");
const customerController = require("../../controller/customerController");
const { requireAuth } = require("../../middleware/Auth");
const validate = require("../../middleware/validate");
const customerValidators = require("../../validators/customer");
const asyncHandler = require("../../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth);

router.get("/", validate(customerValidators.listQuery, "query"), asyncHandler(customerController.list));
router.post("/", validate(customerValidators.create), asyncHandler(customerController.create));
router.get("/:id", validate(customerValidators.customerIdParam, "params"), asyncHandler(customerController.getOne));
router.patch(
  "/:id",
  validate(customerValidators.customerIdParam, "params"),
  validate(customerValidators.update),
  asyncHandler(customerController.update)
);
router.delete("/:id", validate(customerValidators.customerIdParam, "params"), asyncHandler(customerController.remove));
router.get(
  "/:id/transactions",
  validate(customerValidators.customerIdParam, "params"),
  asyncHandler(customerController.getTransactions)
);

module.exports = router;
