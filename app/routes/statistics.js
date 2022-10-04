const controller = require("../controllers/statistics");
const router = require("express").Router();

router.get("/averages", controller.getAverages);
router.get("/expenses", controller.getExpenses);

module.exports = router;
