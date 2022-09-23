const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");

const Role = sequelize.define(
  "role",
  {
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Role.belongsTo(User);
User.hasMany(Role);

module.exports = Role;
