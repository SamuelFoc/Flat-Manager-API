const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Service = sequelize.define(
  "service",
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthly_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Service;
