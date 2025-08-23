const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  tasktitle: { type: String, required: true },
  taskdescription: { type: String, required: true },
  startdate: { type: Date, required: true }, // Use Date type
  enddate: { type: Date, required: true },   // Use Date type
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Add userId field
});
module.exports = mongoose.model("Task", taskSchema);