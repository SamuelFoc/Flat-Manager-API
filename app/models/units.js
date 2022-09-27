const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

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

Unit.sync({ alter: true });

module.exports = Unit;
