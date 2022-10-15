const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Room = sequelize.define(
  "room",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Room;
