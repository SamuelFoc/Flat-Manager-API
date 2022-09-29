const router = require("express").Router();
const controller = require("../controllers/admin");

router
  .post("/register", controller.registerUser)
  .post("/service", controller.createService)
  .post("/unit", controller.createUnit)
  .post("/energy", controller.createEnergy)
  .put("/service/:id", controller.updateService)
  .put("/unit/:id", controller.updateUnit)
  .put("/energy/:id", controller.updateEnergy)
  .put("/user/:username", controller.updateUser)
  .get("/energies", controller.getAllEnergies)
  .get("/units", controller.getAllUnits)
  .get("/users", controller.getAllUsers)
  .get("/services", controller.getAllServices)
  .delete("/energy/:id", controller.deleteEnergy)
  .delete("/service/:id", controller.deleteService)
  .delete("/unit/:id", controller.deleteUnit)
  .delete("/user/:username", controller.deleteUser);

module.exports = router;
