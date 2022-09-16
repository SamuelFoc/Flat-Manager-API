const controller = require("../controllers/event");
const router = require("express").Router();

router
  .get("/:email", controller.getAll)
  .get("/:email/:id", controller.getOne)
  .post("/:email", controller.createOne)
  .put("/:email/:id", controller.updateOne)
  .delete("/:email/:id", controller.deleteOne);

module.exports = router;
