const PaymentAccount = require("../models/paymentAccount");

const sequelize = require("../util/database");

// ! ADMIN PAYMENT CONTROLLERS
exports.getAllPaymentAccounts = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return PaymentAccount.findAll({ where: { isDefault: true } });
    })
    .then((paymentAccounts) => {
      return res.status(200).json({
        count: 1,
        message: `All payment accounts found.`,
        data: paymentAccounts,
      });
    })
    .catch((err) => {
      console.error(err.message);
      return res.status(500).end("Server side error: " + err.message);
    });
};
