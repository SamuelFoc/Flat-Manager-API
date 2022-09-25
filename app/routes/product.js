const controller = require("../controllers/product");
const router = require("express").Router();

router
  .get("/", controller.getAll)
  .get("/:email", controller.getMyAll)
  .get("/:email/:id", controller.getOne)
  .post("/", controller.createOne)
  .put("/:id", controller.updateOne)
  .delete("/:id", controller.deleteOne);

module.exports = router;
