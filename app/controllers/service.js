const Service = require("../models/service");
const sequelize = require("../util/database");

exports.getAll = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Service.findAll();
    })
    .then((services) => {
      return res.status(200).json({
        count: services.length,
        message: `All services found.`,
        data: services,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};
