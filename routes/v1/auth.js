const express = require("express");
const authController = require("../../controller/authController");
const { requireAuth } = require("../../middleware/Auth");
const validate = require("../../middleware/validate");
const authValidators = require("../../validators/auth");
const asyncHandler = require("../../utils/asyncHandler");

const router = express.Router();

router.post("/register", validate(authValidators.register), asyncHandler(authController.register));
router.post("/login", validate(authValidators.login), asyncHandler(authController.login));

router.get("/me", requireAuth, asyncHandler(authController.getMe));
router.put("/me", requireAuth, validate(authValidators.updateProfile), asyncHandler(authController.updateMe));
router.delete("/me", requireAuth, asyncHandler(authController.deleteMe));

module.exports = router;
