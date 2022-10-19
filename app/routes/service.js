const controller = require("../controllers/service");
const router = require("express").Router();

router.get("/", controller.getAll);

module.exports = router;
