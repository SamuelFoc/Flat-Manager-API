const router = require("express").Router();
const controller = require("../controllers/admin");

router
  .post("/register", controller.registerUser)
  .post("/room", controller.createRoom)
  .post("/adduser", controller.addUser)
  .post("/service", controller.createService)
  .post("/unit", controller.createUnit)
  .post("/energy", controller.createEnergy)
  .post("/paymentAccount", controller.createPaymentAccount)
  .put("/service/:id", controller.updateService)
  .put("/unit/:id", controller.updateUnit)
  .put("/energy/:id", controller.updateEnergy)
  .put("/user/:username", controller.updateUser)
  .put("/room/:name", controller.updateRoom)
  .put("/paymentAccount/:name", controller.updatePaymentAccount)
  .get("/energies", controller.getAllEnergies)
  .get("/units", controller.getAllUnits)
  .get("/users", controller.getAllUsers)
  .get("/rooms", controller.getAllRooms)
  .get("/services", controller.getAllServices)
  .get("/paymentAccounts", controller.getAllPaymentAccounts)
  .delete("/energy/:id", controller.deleteEnergy)
  .delete("/service/:id", controller.deleteService)
  .delete("/unit/:id", controller.deleteUnit)
  .delete("/user/:username", controller.deleteUser)
  .delete("/room/:name", controller.deleteRoom)
  .delete("/paymentAccount/:name", controller.deletePaymentAccount);

module.exports = router;
