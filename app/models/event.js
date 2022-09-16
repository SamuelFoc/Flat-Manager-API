const { Sequelize, DataTypes } = require("sequelize");
const User = require("./user");
const sequelize = require("../util/database");

const Event = sequelize.define(
  "event",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripiton: {
      type: DataTypes.STRING,
      defaultValue: "No description given by creator..",
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    invited_number: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

Event.belongsTo(User);
User.hasMany(Event);

module.exports = Event;
