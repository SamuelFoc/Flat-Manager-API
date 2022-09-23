const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Room = sequelize.define(
  "room",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_of_livings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Room;
