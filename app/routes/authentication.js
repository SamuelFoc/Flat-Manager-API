const router = require("express").Router();
const controller = require("../controllers/authentication");

router.post("/", controller.login);

module.exports = router;
