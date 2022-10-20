const router = require("express").Router();
const controller = require("../controllers/paymentAccounts");

router.get("/", controller.getAllPaymentAccounts);

module.exports = router;
