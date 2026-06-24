const express = require("express");
const saleController = require("../../controller/saleController");
const { requireAuth } = require("../../middleware/Auth");
const validate = require("../../middleware/validate");
const saleValidators = require("../../validators/sale");
const asyncHandler = require("../../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth);

router.get("/", validate(saleValidators.listQuery, "query"), asyncHandler(saleController.list));
router.post("/cash", validate(saleValidators.cashSale), asyncHandler(saleController.cashSale));
router.post("/credit", validate(saleValidators.creditSale), asyncHandler(saleController.creditSale));
router.post("/payment", validate(saleValidators.payment), asyncHandler(saleController.payment));

module.exports = router;
