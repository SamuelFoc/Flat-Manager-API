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
    measured_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
  }
);

Energy.sync({ alter: true });

module.exports = Energy;
