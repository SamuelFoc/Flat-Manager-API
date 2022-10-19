const controller = require("../controllers/user");
const router = require("express").Router();

router.get("/", controller.getAll).get("/:email", controller.getOne);

module.exports = router;
