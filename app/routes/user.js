const controller = require("../controllers/user");
const router = require("express").Router();

router
  .get("/", controller.getAll)
  .get("/:email", controller.getOne)
  .delete("/:email", controller.deleteOne);

module.exports = router;
