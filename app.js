require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
const v1Routes = require("./routes/v1");
const errorHandler = require("./middleware/errorHandler");
const { sendError } = require("./utils/apiResponse");

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "https://todoapp-frontend-pi.vercel.app",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Taneer Shop Manager API",
    docs: "/api/v1",
  });
});

app.get("/api/v1", (req, res) => {
  res.json({
    success: true,
    message: "Taneer Shop Manager API v1",
    endpoints: {
      auth: "/api/v1/auth",
      products: "/api/v1/products",
      customers: "/api/v1/customers",
      sales: "/api/v1/sales",
      reports: "/api/v1/reports",
    },
  });
});

app.use("/api/v1", v1Routes);

app.use((req, res) => {
  sendError(res, "Route not found", 404);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Taneer Shop Manager running on port ${PORT}...`);
});
