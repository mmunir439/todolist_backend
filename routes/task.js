const express = require("express");
const taskController = require("../controller/task");
const { requireAuth } = require("../middleware/Auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello task route");
});

router.post("/addtask", requireAuth, taskController.addtask);
router.get("/getTasks", requireAuth, taskController.getTasks);
router.get("/getTask/:id", requireAuth, taskController.getTaskById);
router.put("/updateTask/:id", requireAuth, taskController.updateTask);
router.delete("/deleteTask/:id", requireAuth, taskController.deleteTask);
module.exports = router;