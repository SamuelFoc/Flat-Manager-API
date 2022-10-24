const router = require("express").Router();
const controller = require("../controllers/payment");

router
  .post("/:username", controller.createPayment)
  .get("/:username", controller.getAllPayments)
  .put("/:id", controller.updatePayment)
  .delete("/:id", controller.deletePayment);

module.exports = router;
