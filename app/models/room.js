const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Room = sequelize.define(
  "room",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pay_day: {
      type: DataTypes.NUMBER,
    },
    paid_on: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Room;
