const Task = require("../model/task");

// Add a new task
exports.addtask = async (req, res) => {
  try {
    const { tasktitle, taskdescription, startdate, enddate } = req.body;

    const userId = req.user.userId; // Assuming `req.user` is populated by authentication middleware

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newTask = new Task({ tasktitle, taskdescription, startdate, enddate, userId });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming `req.user` is populated by authentication middleware
    const tasks = await Task.find({ userId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { tasktitle, taskdescription, startdate, enddate, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { tasktitle, taskdescription, startdate, enddate, completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};