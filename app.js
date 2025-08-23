require('dotenv').config();
const express = require('express');
const cors = require('cors');
const user = require('./routes/user');
const task = require('./routes/task');
const PORT = process.env.PORT || 3000;
const connectDB = require('./utils/db');
const app = express();
// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});
app.use("/user", user);
app.use("/task", task);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});