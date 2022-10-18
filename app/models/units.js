const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");
require("dotenv").config();

const Unit = sequelize.define(
  "unit",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Unit;
