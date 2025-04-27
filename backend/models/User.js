"use strict";

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  // Association: A User has many QuizResults
  User.associate = (models) => {
    User.hasMany(models.QuizResult, {
      foreignKey: "userId", // Foreign key in QuizResult table
      as: "quizResults", // Alias for the association
    });
  };

  return User;
};
