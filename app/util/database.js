const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlite-db", "admin-samuel", "admin-root", {
  dialect: "sqlite",
  storage: "./app/DB/database.sqlite",
  logging: false,
});

module.exports = sequelize;
