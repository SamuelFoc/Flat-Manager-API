const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Payment = sequelize.define(
  "payment",
  {
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    iban: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Payment;
