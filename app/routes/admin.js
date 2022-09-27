const router = require("express").Router();
const controller = require("../controllers/admin");

router
  .post("/register", controller.registerUser)
  .post("/services", controller.createService)
  .post("/units", controller.createUnit)
  .put("/service/:id", controller.updateService)
  .get("/energies", controller.getAllEnergies)
  .get("/units", controller.getAllUnits)
  .get("/users", controller.getAllUsers)
  .get("/services", controller.getAllServices)
  .delete("/energy/:id", controller.deleteEnergy)
  .delete("/service/:id", controller.deleteService)
  .delete("/unit/:id", controller.deleteUnit)
  .delete("/user/:username", controller.deleteUser);

module.exports = router;
