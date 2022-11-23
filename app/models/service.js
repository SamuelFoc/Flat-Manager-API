const { Sequelize, DataTypes } = require("sequelize");
const User = require("./user");
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

User.hasMany(Service);
Service.belongsTo(User);

//Service.sync({ alter: true });

module.exports = Service;
