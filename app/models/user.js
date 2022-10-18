const { DataTypes } = require("sequelize");
const Room = require("./room");
const sequelize = require("../util/database");
require("dotenv").config();

const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      set(value) {
        if (value < 18) {
          throw new Error("User must be at least 18!");
        } else {
          this.setDataValue("age", value);
        }
      },
    },
    work: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

User.belongsTo(Room);
Room.hasMany(User);

module.exports = User;
