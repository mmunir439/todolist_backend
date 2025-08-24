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
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("Welcome to the Todo API");
});
app.use("/user", user);
app.use("/task", task);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});