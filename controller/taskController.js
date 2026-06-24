const taskService = require("../services/taskService");
const { sendSuccess } = require("../utils/apiResponse");

exports.list = async (req, res) => {
  const tasks = await taskService.listTasks(req.user.userId, req.query);
  sendSuccess(res, tasks);
};

exports.getOne = async (req, res) => {
  const task = await taskService.getTask(req.user.userId, req.params.id);
  sendSuccess(res, task);
};

exports.create = async (req, res) => {
  const task = await taskService.createTask(req.user.userId, req.body);
  sendSuccess(res, task, 201);
};

exports.update = async (req, res) => {
  const task = await taskService.updateTask(req.user.userId, req.params.id, req.body);
  sendSuccess(res, task);
};

exports.complete = async (req, res) => {
  const task = await taskService.completeTask(req.user.userId, req.params.id);
  sendSuccess(res, task);
};

exports.remove = async (req, res) => {
  await taskService.deleteTask(req.user.userId, req.params.id);
  sendSuccess(res, { message: "Task deleted successfully" });
};
