const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
app.use(express.json());

app.use("/users", userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
