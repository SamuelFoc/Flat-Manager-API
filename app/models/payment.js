const { DataTypes } = require("sequelize");
const User = require("./user");
const sequelize = require("../util/database");

const Payment = sequelize.define(
  "payment",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripiton: {
      type: DataTypes.STRING,
      defaultValue: "No description given by creator..",
    },
    pay_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iban: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    am: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ss: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vs: {
      type: DataTypes.STRING,
    },
    rn: {
      type: DataTypes.STRING,
    },
    msg: {
      type: DataTypes.STRING,
    },
    cc: {
      type: DataTypes.STRING,
    },
    last_paid: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Payment.belongsTo(User);
User.hasMany(Payment);

// Payment.sync({ force: true });

module.exports = Payment;
