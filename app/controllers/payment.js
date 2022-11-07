const Payment = require("../models/payment");
const User = require("../models/user");
const sequelize = require("../util/database");

exports.createPayment = (req, res) => {
  // Get all information about the payment
  const { username } = req.params;
  const { title, description, pay_day, iban, am, ss, vs, cs, rn, msg } =
    req.body;

  // Create payment model
  const PAYMENT_MODEL = {
    title: title ? title : null,
    description: description ? description : null,
    pay_day: pay_day ? pay_day : 15,
    iban: iban ? iban : null,
    am: am ? am : null,
    ss: ss ? ss : null,
    vs: vs ? vs : null,
    cs: cs ? cs : null,
    rn: rn ? rn : null,
    msg: msg ? msg : null,
  };

  // Create payment
  Payment.create(PAYMENT_MODEL)
    .then(async (payment) => {
      const user = await User.findOne({ where: { username: username } });
      await user.addPayment(payment);

      res.status(201).json({
        count: 1,
        message: `New payment for user: ${username}, has been created.`,
        data: payment,
      });
    })
    .catch((err) => {
      if (!title || !iban) {
        return res.status(400).send("Title and iban are required.");
      }
      console.log(err.message);
      res.status(500).send("Server side error: " + err.message);
    });
};

exports.getAllPayments = (req, res) => {
  //Get user information
  const { username } = req.params;

  //Find user and his payments
  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send("🤷 Cannot find user with specified username.");
      } else {
        return user.getPayments();
      }
    })
    .then((payments) => {
      return res.status(200).json({
        count: payments.length,
        message: `All payments of user ${username} found.`,
        data: payments,
      });
    })
    .catch((err) => {
      return res.status(500).send("Server side error: " + err.message);
    });
};

exports.updatePayment = (req, res) => {
  // Get payment details
  const { id } = req.params;

  // Get values to update
  const {
    title,
    description,
    pay_day,
    iban,
    am,
    ss,
    vs,
    cs,
    rn,
    msg,
    last_paid,
  } = req.body;

  // Get payment to update
  Payment.findOne({ where: { id: id } })
    .then((_payment) => {
      _payment.title = title ? title : _payment.title;
      _payment.description = description ? description : _payment.description;
      _payment.pay_day = pay_day ? pay_day : _payment.pay_day;
      _payment.iban = iban ? iban : _payment.iban;
      _payment.am = am ? am : _payment.am;
      _payment.ss = ss ? ss : _payment.ss;
      _payment.vs = vs ? vs : _payment.vs;
      _payment.cs = cs ? cs : _payment.cs;
      _payment.rn = rn ? rn : _payment.rn;
      _payment.msg = msg ? msg : _payment.msg;
      _payment.last_paid = last_paid ? last_paid : _payment.last_paid;
      _payment.save();
      return _payment;
    })
    .then((payment) => {
      res.status(200).json({
        count: 1,
        message: `Payment with id ${id} updated.`,
        data: payment,
      });
    })
    .catch((err) => {
      if (!id) {
        return res.status(400).send("Id is required path parameter.");
      }
      res.status(500).send("Server side error: " + err.message);
    });
};

exports.deletePayment = (req, res) => {
  // Get payment information
  const { id } = req.params;

  // Find the payment to be deleted
  Payment.destroy({ where: { id: id } })
    .then((payment) => {
      res.status(200).json({
        count: 1,
        message: `Payment with id ${payment.id} deleted.`,
        data: payment,
      });
    })
    .catch((err) => {
      if (!id) {
        return res.status(400).send("Id is required path parameter.");
      }
      res.status(500).send("Server side error: " + err.message);
    });
};
