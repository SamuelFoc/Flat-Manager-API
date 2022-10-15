const controller = require("../controllers/room");
const router = require("express").Router();

router
  .get("/", controller.getAll)
  .get("/:name", controller.getOne)
  .post("/", controller.createOne)
  .post("/adduser", controller.addUser)
  .put("/:name", controller.updateOne)
  .delete("/:name", controller.deleteOne);

module.exports = router;
