const controller = require("../controllers/energy");
const router = require("express").Router();

router
  .get("/", controller.getAll)
  .get("/:type", controller.getOneType)
  .post("/", controller.createOne)
  .delete("/:id", controller.deleteOne);

module.exports = router;
