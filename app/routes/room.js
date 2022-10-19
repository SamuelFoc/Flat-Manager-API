const controller = require("../controllers/room");
const router = require("express").Router();

router.get("/", controller.getAll).get("/:name", controller.getOne);

module.exports = router;
