const express = require("express");
const reportController = require("../../controller/reportController");
const { requireAuth } = require("../../middleware/Auth");
const asyncHandler = require("../../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth);

router.get("/dashboard", asyncHandler(reportController.dashboard));
router.get("/daily", asyncHandler(reportController.daily));

module.exports = router;
