const router = require("express").Router();
const controller = require("../controllers/payment");

router.get("/", controller.getAllPayments);

module.exports = router;
