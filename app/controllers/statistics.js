const statBox = require("./utils/statisticsBox");
const reporter = require("../reports/controller");

exports.getAverages = async (req, res) => {
  let electricity, water, gas;

  try {
    electricity = await statBox._getAvgOf("Electricity");
    water = await statBox._getAvgOf("Water");
    gas = await statBox._getAvgOf("Gas");
  } catch (error) {
    res.status(500).end(error.message);
  }

  res.status(200).json({
    electricity: electricity,
    water: water,
    gas: gas,
  });
};

exports.getExpenses = async (req, res) => {
  let electricity, water, gas;

  try {
    electricity = await statBox._getAvgExpensesOf("Electricity");
    water = await statBox._getAvgExpensesOf("Water");
    gas = await statBox._getAvgExpensesOf("Gas");
  } catch (error) {
    res.status(500).end(error.message);
  }
  res.status(200).json({
    electricity: electricity,
    water: water,
    gas: gas,
  });
};

exports.getSummary = async (req, res) => {
  let electricity, water, gas;

  try {
    electricity = await statBox._createSumaryOf("Electricity");
    water = await statBox._createSumaryOf("Water");
    gas = await statBox._createSumaryOf("Gas");
  } catch (error) {
    res.status(500).end(error.message);
  }

  res.status(200).json({
    electricity_summary: electricity,
    water_summary: water,
    gas_summary: gas,
  });
};

exports.generateReport = (req, res) => {
  const { type, from, to } = req.body;
  reporter
    .createConsumptionReportOf(type, from, to)
    .then(() => {
      res.status(200).json("Report generated.");
    })
    .catch((err) => {
      res.send(400).json(err.message);
    });
};

exports.downloadReport = (req, res) => {
  console.log(req.params);
  try {
    res.download(`app/reports/documents/${req.params.type}_report.pdf`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
