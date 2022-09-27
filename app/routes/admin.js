const router = require("express").Router();
const controller = require("../controllers/admin");

router
  .post("/register", controller.registerUser)
  .get("/energies", controller.getAllEnergies)
  .delete("/energy/:id", controller.deleteEnergy);

module.exports = router;
