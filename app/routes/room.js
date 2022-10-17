const controller = require("../controllers/room");
const router = require("express").Router();

router
  .get("/", controller.getAll)
  .get("/:name", controller.getOne)
  .post("/", controller.createOne)
  .put("/:name", controller.updateOne)
  .delete("/:name", controller.deleteOne);

module.exports = router;
