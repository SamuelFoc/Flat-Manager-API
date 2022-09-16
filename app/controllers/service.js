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

exports.getOne = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Service.findAll({ where: { id: req.params.id } });
    })
    .then((service) => {
      return res.status(200).json({
        count: service.length,
        message: `Service found.`,
        data: service,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.createOne = (req, res) => {
  const input = req.body;

  const SERVICE_MODEL = {
    type: input.type ? input.type : new Error("Type is required!"),
    monthly_price: input.monthly_price ? input.monthly_price : 1500,
    start_date: input.start_date ? input.start_date : new Date(),
  };

  sequelize
    .sync()
    .then(() => {
      return Service.create(SERVICE_MODEL);
    })
    .then((service) => {
      return res.status(200).json({
        count: 1,
        message: `Service has been recorded.`,
        data: service,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.deleteOne = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Service.destroy({ where: { id: req.params.id } });
    })
    .then((service) => {
      return res.status(200).json({
        count: 1,
        message: `Service removed.`,
        data: service,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.updateOne = (req, res) => {
  const input = req.body;

  sequelize
    .sync()
    .then(() => {
      return Service.findOne({
        where: {
          id: req.params.id,
        },
      });
    })
    .then((service) => {
      const SERVICE_MODEL = {
        type: input.type ? input.type : service.type,
        monthly_price: input.monthly_price
          ? input.monthly_price
          : service.monthly_price,
        start_date: input.start_date ? input.start_date : service.start_date,
      };

      return Service.update(SERVICE_MODEL, {
        where: {
          id: req.params.id,
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: 1,
        message: `Service updated.`,
        data: event,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};
