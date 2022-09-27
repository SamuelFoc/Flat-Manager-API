const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("sqlite-db", "admin-samuel", "admin-root", {
  dialect: "sqlite",
  storage: process.env.DEV
    ? "./app/DB/test-database.sqlite"
    : "./app/DB/database.sqlite",
  logging: false,
});

module.exports = sequelize;
