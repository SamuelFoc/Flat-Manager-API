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
  const { type, measured, date } = req.body;
  const ENERGY_MODEL = {
    type: type ? type : new Error("Type is required!"),
    measured_value: measured
      ? measured
      : new Error("Measured value is required!"),
    measured_at: date ? date : new Date(),
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
  const { type, measured_value, date } = req.body;

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
        type: type ? type : energy.type,
        measured_value: measured_value ? measured_value : energy.measured_value,
        measured_at: date ? date : energy.measured_at,
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
