const express = require("express");
const authRoutes = require("./auth");
const productRoutes = require("./products");
const customerRoutes = require("./customers");
const saleRoutes = require("./sales");
const reportRoutes = require("./reports");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/customers", customerRoutes);
router.use("/sales", saleRoutes);
router.use("/reports", reportRoutes);

module.exports = router;
