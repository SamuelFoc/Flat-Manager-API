const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Energy = sequelize.define(
  "energy",
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measured_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Energy;
