const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");

const Responsibility = sequelize.define(
  "responsibility",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    urgent: {
      type: DataTypes.STRING,
      defaultValue: "LOW",
    },
  },
  {
    timestamps: true,
  }
);

Responsibility.belongsTo(User);
User.hasMany(Responsibility);

module.exports = Responsibility;
