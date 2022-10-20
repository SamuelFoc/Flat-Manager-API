const router = require("express").Router();
const controller = require("../controllers/payment");

router
  .post("/:email", controller.createPayment)
  .get("/:email", controller.getAllPayments)
  .put("/:email/:id", controller.updatePayment)
  .delete("/:email/:id", controller.deletePayment);

module.exports = router;
