const express = require("express");
const taskController = require("../../controller/taskController");
const { requireAuth } = require("../../middleware/Auth");
const validate = require("../../middleware/validate");
const taskValidators = require("../../validators/task");
const asyncHandler = require("../../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth);

router.get("/", validate(taskValidators.listQuery, "query"), asyncHandler(taskController.list));
router.post("/", validate(taskValidators.create), asyncHandler(taskController.create));
router.get("/:id", validate(taskValidators.taskIdParam, "params"), asyncHandler(taskController.getOne));
router.patch(
  "/:id",
  validate(taskValidators.taskIdParam, "params"),
  validate(taskValidators.update),
  asyncHandler(taskController.update)
);
router.delete("/:id", validate(taskValidators.taskIdParam, "params"), asyncHandler(taskController.remove));
router.post("/:id/complete", validate(taskValidators.taskIdParam, "params"), asyncHandler(taskController.complete));

module.exports = router;
