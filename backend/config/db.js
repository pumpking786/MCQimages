const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mcqimages", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Test the database connection
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");

    // Sync models
    // await sequelize.sync({ alter: true }); // use { force: true } to reset tables
    // console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

connectToDatabase();

module.exports = sequelize;
