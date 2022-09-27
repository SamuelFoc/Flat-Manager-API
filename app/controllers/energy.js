const Energy = require("../models/energy");
const sequelize = require("../util/database");

exports.getAll = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Energy.findAll({ order: [["updatedAt", "DESC"]] });
    })
    .then((energies) => {
      const water = energies.filter(
        (energy) => energy.type.toLowerCase() === "water"
      );
      const gas = energies.filter(
        (energy) => energy.type.toLowerCase() === "gas"
      );
      const electricity = energies.filter(
        (energy) => energy.type.toLowerCase() === "electricity"
      );
      return res.status(200).json({
        count: energies.length,
        message: `All energies found.`,
        data: {
          gas: gas,
          water: water,
          electricity: electricity,
        },
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.getOneType = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Energy.findAll({ where: { type: req.params.type } });
    })
    .then((energy) => {
      return res.status(200).json({
        count: energy.length,
        message: `Energy found.`,
        data: energy,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.createOne = (req, res) => {
  const { type, measured, unit_price } = req.body;
  const ENERGY_MODEL = {
    type: type ? type : new Error("Type is required!"),
    measured_value: measured
      ? parseInt(measured)
      : new Error("Measured value is required!"),
    unit_price: unit_price ? unit_price : 10,
  };

  sequelize
    .sync()
    .then(() => {
      return Energy.create(ENERGY_MODEL);
    })
    .then((energy) => {
      return res.status(200).json({
        count: 1,
        message: `Measured value has been written.`,
        data: energy,
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
      return Energy.destroy({ where: { id: req.params.id } });
    })
    .then((energy) => {
      return res.status(200).json({
        count: 1,
        message: `Enery record removed.`,
        data: energy,
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
      return Energy.findOne({
        where: {
          id: req.params.id,
        },
      });
    })
    .then((energy) => {
      const ENERGY_MODEL = {
        type: input.type ? input.type : energy.type,
        measured_value: input.measured_value
          ? input.measured_value
          : energy.measured_value,
        unit_price: input.unit_price ? input.unit_price : energy.unit_price,
      };

      return Energy.update(ENERGY_MODEL, {
        where: {
          id: req.params.id,
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: 1,
        message: `Record updated.`,
        data: event,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};
