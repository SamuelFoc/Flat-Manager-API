const Payment = require("../models/payment");

const sequelize = require("../util/database");

// ! ADMIN PAYMENT CONTROLLERS
exports.getAllPayments = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Payment.findAll({ where: { isDefault: true } });
    })
    .then((payments) => {
      return res.status(200).json({
        count: 1,
        message: `All payments found.`,
        data: payments,
      });
    })
    .catch((err) => {
      console.error(err.message);
      return res.status(500).end("Server side error: " + err.message);
    });
};
