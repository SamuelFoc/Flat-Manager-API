const Energy = require("../models/energy");
const Unit = require("../models/units");
const sequelize = require("../util/database");

const getAverage = (array) => {
  let arrayLength = array.length;
  let averagesArray = [];
  let labels = [];

  for (let i = 1; i < arrayLength; i++) {
    let dayDifference =
      (new Date(array[i].measured_at) - new Date(array[i - 1].measured_at)) /
      86400000;

    let lilAverage =
      (array[i].measured_value - array[i - 1].measured_value) / dayDifference;

    labels.push(
      `From ${new Date(array[i - 1].measured_at).toLocaleDateString(
        "en-GB"
      )} to ${new Date(array[i].measured_at).toLocaleDateString("en-GB")}`
    );
    averagesArray.push(lilAverage);
  }
  return {
    avg: averagesArray,
    labels: labels,
  };
};

const getDiff = (array) => {
  let arrayLength = array.length;
  let valueDiffsArray = [];
  let labels = [];

  for (let i = 1; i < arrayLength; i++) {
    valueDiffsArray.push(array[i].measured_value - array[i - 1].measured_value);

    labels.push(
      `From ${new Date(array[i - 1].measured_at).toLocaleDateString(
        "en-GB"
      )} to ${new Date(array[i].measured_at).toLocaleDateString("en-GB")}`
    );
  }
  return {
    valueDifference: valueDiffsArray,
    labels: labels,
  };
};

exports.getAverages = (req, res) => {
  sequelize
    .sync()
    .then(async () => {
      return await Energy.findAll({ order: [["measured_at", "ASC"]] });
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

      const waterAvg = water.length > 1 ? getAverage(water) : [];
      const gasAvg = gas.length > 1 ? getAverage(gas) : [];
      const electricityAvg =
        electricity.length > 1 ? getAverage(electricity) : [];

      return {
        electricity: electricityAvg,
        water: waterAvg,
        gas: gasAvg,
      };
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).send({ ERROR: err.message });
    });
};

exports.getExpenses = (req, res) => {
  let eleExpenses = [];
  let waterExpenses = [];
  let gasExpenses = [];
  let eleLabels, gasLabels, waterLabels;

  sequelize
    .sync()
    .then(async () => {
      const units = await Unit.findAll();
      const energies = await Energy.findAll({
        order: [["measured_at", "ASC"]],
      });
      return { energies: energies, units: units };
    })
    .then((data) => {
      const water = data.energies.filter(
        (energy) => energy.type.toLowerCase() === "water"
      );
      const gas = data.energies.filter(
        (energy) => energy.type.toLowerCase() === "gas"
      );
      const electricity = data.energies.filter(
        (energy) => energy.type.toLowerCase() === "electricity"
      );

      // * Unit prices of individual energies
      const eleUnit = data.units.filter(
        (unit) => unit.name.toLowerCase() === "electricity"
      );
      const watUnit = data.units.filter(
        (unit) => unit.name.toLowerCase() === "water"
      );
      const gasUnit = data.units.filter(
        (unit) => unit.name.toLowerCase() === "gas"
      );

      // * Differences between measures
      if (water.length > 1 && watUnit) {
        const { avg, labels } = getAverage(water);
        for (let i = 0; i < avg.length; i++) {
          waterExpenses.push(avg[i] * watUnit[0].unit_price);
        }
        waterLabels = labels;
      }
      if (gas.length > 1 && watUnit) {
        const { avg, labels } = getAverage(gas);
        for (let i = 0; i < avg.length; i++) {
          gasExpenses.push(avg[i] * gasUnit[0].unit_price);
        }
        gasLabels = labels;
      }
      if (electricity.length > 1 && watUnit) {
        const { avg, labels } = getAverage(electricity);
        for (let i = 0; i < avg.length; i++) {
          eleExpenses.push(avg[i] * eleUnit[0].unit_price);
        }
        eleLabels = labels;
      }

      return {
        electricity: {
          data: eleExpenses,
          labels: eleLabels,
        },
        water: {
          data: waterExpenses,
          labels: waterLabels,
        },
        gas: {
          data: gasExpenses,
          labels: gasLabels,
        },
      };
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).send({ ERROR: err.message });
    });
};
