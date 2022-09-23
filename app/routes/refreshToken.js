const router = require("express").Router();
const controller = require("../controllers/refreshToken");

router.get("/", controller.handleRefreshToken);

module.exports = router;
