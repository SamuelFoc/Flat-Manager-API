const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Comment = sequelize.define(
  "comment",
  {
    author: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Comment;
