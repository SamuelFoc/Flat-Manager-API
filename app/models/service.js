const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");
require("dotenv").config();

const Service = sequelize.define(
  "service",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthly_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pay_day: {
      type: DataTypes.NUMBER,
    },
  },
  {
    timestamps: true,
  }
);

if (process.env?.DEV) {
  Service.sync({ alter: true });
}

module.exports = Service;
