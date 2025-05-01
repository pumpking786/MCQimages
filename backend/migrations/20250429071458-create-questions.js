"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("questions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      questionImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      options: {
        type: Sequelize.JSON, // Compatible with MySQL
        allowNull: false,
      },
      correctAnswer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hint: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("questions");
  },
};
