const express = require("express");
const cors = require("cors");
const app = express();

const userRoutes = require("./routes/userRoutes");
const sessionMiddleware = require("./middleware/session");

// ✅ Enable CORS with credentials
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,               // Allow cookies from frontend
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Use session middleware before routes
app.use(sessionMiddleware());

// ✅ Mount routes
app.use("/users", userRoutes);

// ✅ Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
