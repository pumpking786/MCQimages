const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash the password to store in the database
    const hashedPassword = await bcrypt.hash("perman", 10);

    // Insert sample user data into the 'Users' table
    await queryInterface.bulkInsert("Users", [
      {
        name: "Perman",
        age: 25,
        username: "perman",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Delete the seeded users if needed
    await queryInterface.bulkDelete("Users", null, {});
  },
};
