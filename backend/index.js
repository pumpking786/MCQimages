require('dotenv').config();
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sessionMiddleware = require("./middleware/session");
const corsMiddleware=require("./middleware/cors")
const errorHandler = require('./middleware/errorHandling');

app.use(corsMiddleware);
// ✅ Parse incoming JSON
app.use(express.json());
// ✅ Use session middleware before routes
app.use(sessionMiddleware());

// ✅ Mount routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/quizresult", resultRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);

// ✅ Start server
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

// ✅ Graceful shutdown
const shutdown = () => {
  console.log("\nGracefully shutting down...");
  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forcefully shutting down...");
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
