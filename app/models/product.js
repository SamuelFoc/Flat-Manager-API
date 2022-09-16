const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const User = require("./user");

const Product = sequelize.define(
  "product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "unknown",
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ownership: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    urgent: {
      type: DataTypes.STRING,
      defaultValue: "LOW",
      set(value) {
        this.setDataValue("urgent", value.toUpperCase());
      },
    },
  },
  {
    timestamps: true,
  }
);

Product.belongsTo(User);
User.hasMany(Product);

module.exports = Product;
