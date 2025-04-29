"use strict";

const { DataTypes } = require("sequelize"); 

// models/Question.js
module.exports = (sequelize) => {
    const Question = sequelize.define(
      "Question",
      {
        questionImage: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        question: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        options: {
            type: DataTypes.JSON, // Store array as JSON
            allowNull: false,
          },
          
        correctAnswer: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        hint: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: "questions",
        timestamps: false,
      }
    );
  
    return Question;
  };
  