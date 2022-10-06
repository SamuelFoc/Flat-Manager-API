const controller = require("../controllers/statistics");
const router = require("express").Router();

router
  .get("/averages", controller.getAverages)
  .get("/expenses", controller.getExpenses)
  .get("/summary", controller.getSummary)
  .get("/report/:type", controller.getReport);

module.exports = router;
