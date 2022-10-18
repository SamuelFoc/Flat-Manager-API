const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("sqlite-db", "admin-samuel", "admin-root", {
  dialect: "sqlite",
  storage:
    process.env.TEST_DB === "true"
      ? "./app/DB/test-database.sqlite"
      : "./app/DB/production-database.sqlite",
  logging: false,
});

sequelize.sync().then(() => {
  process.env.TEST_DB === "true"
    ? console.log(
        "\x1b[36m%s\x1b[0m",
        "INFO: Connected to DB => You are using the TEST DATABASE."
      )
    : console.log(
        "\x1b[36m%s\x1b[0m",
        "INFO: Connected to DB => You are using the PRODUCTION DATABASE."
      );
});

// DATABASE REFRESHER
if (
  process.env.ALTER_MODELS === "true" ||
  process.env.FORCE_MODELS === "true"
) {
  sequelize
    .sync(
      process.env.FORCE_MODELS === "true" ? { force: true } : { alter: true }
    )
    .then((info) =>
      process.env.FORCE_MODELS === "true"
        ? console.log(
            "\x1b[31m%s\x1b[0m",
            "DB DATA DAMAGED: All data in DB has been destroyed due to FORCE update. => ",
            info.models
          )
        : console.log(
            "\x1b[31m%s\x1b[0m",
            "DB DATA MAY BE DAMAGED: All DB models has been ALTER updated. => ",
            info.models
          )
    )
    .catch((err) =>
      console.log("Error occured during models update. => ", err)
    );
}

module.exports = sequelize;
