const Task = require("../model/task");
const AppError = require("../utils/AppError");
const { getDateRange } = require("../utils/taskQueries");

exports.getTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

exports.listTasks = async (userId, query = {}) => {
  const { status, due } = query;
  const filter = { userId };

  if (status) filter.status = status;
  Object.assign(filter, getDateRange(due));

  return Task.find(filter).sort({ createdAt: -1 });
};

exports.createTask = async (userId, data) => {
  return Task.create({ ...data, userId });
};

exports.updateTask = async (userId, taskId, data) => {
  const task = await Task.findOneAndUpdate({ _id: taskId, userId }, data, {
    new: true,
    runValidators: true,
  });

  if (!task) throw new AppError("Task not found", 404);
  return task;
};

exports.completeTask = async (userId, taskId) => {
  return exports.updateTask(userId, taskId, { status: "done" });
};

exports.deleteTask = async (userId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) throw new AppError("Task not found", 404);
};
