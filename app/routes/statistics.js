const controller = require("../controllers/statistics");
const router = require("express").Router();

router
  .get("/averages", controller.getAverages)
  .get("/expenses", controller.getExpenses)
  .get("/summary", controller.getSummary)
  .get("/downloadReport/:type", controller.downloadReport)
  .post("/generateReport", controller.generateReport);

module.exports = router;
