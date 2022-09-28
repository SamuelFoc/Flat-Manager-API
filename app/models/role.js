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

if (process.env?.DEV) {
  Role.sync({ alter: true });
}

module.exports = Role;
