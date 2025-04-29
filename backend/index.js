const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

const userRoutes = require("./routes/userRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sessionMiddleware = require("./middleware/session");

// ✅ Enable CORS with credentials
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Use session middleware before routes
app.use(sessionMiddleware());

// ✅ Mount routes
app.use("/users", userRoutes);
app.use("/quizresult", resultRoutes);
app.use("/admin", adminRoutes);

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
