'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const QuizResult = sequelize.define(
    "QuizResult",
    {
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users", // Refers to the 'users' table
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "quiz_results",
      timestamps: true, // Automatically creates `createdAt` and `updatedAt`
    }
  );

  // Association: A QuizResult belongs to one User
  QuizResult.associate = (models) => {
    QuizResult.belongsTo(models.User, {
      foreignKey: "userId", // Foreign key in QuizResult table
      as: "user", // Alias for the association
    });
  };

  return QuizResult;
};
