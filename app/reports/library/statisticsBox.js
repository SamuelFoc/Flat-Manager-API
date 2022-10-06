const Energy = require("../../models/energy");
const Service = require("../../models/service");
const Unit = require("../../models/units");

// !PRIVATE FUNCTIONS
const __getAverage = (array) => {
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
    averagesArray.push(parseFloat(lilAverage.toFixed(2)));
  }
  return {
    avg: averagesArray,
    labels: labels,
  };
};

const __daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};
// !END OF PRIVATE FUNCTIONS

const _createSumaryOf = async (Name) => {
  let EnergyData, UnitData, ServiceData;
  // * Get data from DB
  try {
    EnergyData = await Energy.findAll({
      where: { type: Name },
      order: [["measured_at", "ASC"]],
    });
    UnitData = await Unit.findOne({ where: { name: Name } });
    ServiceData = await Service.findOne({
      where: { name: Name },
    });
  } catch (err) {
    console.log(err);
    return new Error("Failed to fetch DB.");
  }

  // * Have a look if there are enough data for summary
  if (EnergyData.length < 2) {
    return new Error("Not enough data available.");
  }

  // * Compute used amount of energies
  let diffs = [];
  let summaryBounds = [];
  for (let i = 1; i < EnergyData.length; i++) {
    diffs.push(EnergyData[i].measured_value - EnergyData[i - 1].measured_value);

    if (i === 1) {
      summaryBounds.push(new Date(EnergyData[0].measured_at));
    }
    if (i === EnergyData.length - 1) {
      summaryBounds.push(new Date(EnergyData[i].measured_at));
    }
  }
  diffs = diffs.reduce((partialSum, a) => partialSum + a, 0);
  summaryBounds.push(
    (new Date(summaryBounds[1]) - new Date(summaryBounds[0])) / 86400000
  );

  //* Compute units and monthly payments
  const unitPrice = UnitData.unit_price;
  const unit = UnitData.unit;
  const monthlyPrice = ServiceData.monthly_price;

  // * Compute the real price of used energies
  let realPrice = diffs * unitPrice;
  let numOfDays = summaryBounds[2];
  let predictedPrice = (monthlyPrice / 31) * numOfDays;

  // * Compute arrears and overpayments
  const arrears = realPrice - predictedPrice;
  const overpayments = predictedPrice - realPrice;

  // * Create summary
  return {
    name: Name,
    real_consumption: diffs.toFixed(2),
    from: summaryBounds[0]?.toLocaleDateString("en-GB"),
    to: summaryBounds[1]?.toLocaleDateString("en-GB"),
    days: summaryBounds[2],
    unit_price: unitPrice,
    unit: unit,
    real_consumption_price: realPrice.toFixed(2),
    predictedPrice: predictedPrice.toFixed(2),
    arrears: arrears > 0 ? arrears.toFixed(2) : 0,
    overpayments: overpayments > 0 ? overpayments.toFixed(2) : 0,
    price_currency: "CZK",
  };
};

const _getAvgExpensesOf = async (Name) => {
  let UnitData, EnergyData;

  // * Get data from DB
  try {
    UnitData = await Unit.findOne({ where: { name: Name } });
    EnergyData = await Energy.findAll({
      where: { type: Name },
      order: [["measured_at", "ASC"]],
    });
  } catch (error) {
    console.log(error);
    return new Error("Failed to fetch DB.");
  }

  // * Check if there is enough data and
  if (EnergyData.length < 2 || !UnitData) {
    return new Error("Not enough data available.");
  }

  const { avg, labels } = __getAverage(EnergyData);
  let expenses = [];
  for (let i = 0; i < avg.length; i++) {
    expenses.push(parseFloat((avg[i] * UnitData.unit_price).toFixed(2)));
  }

  return {
    data: expenses,
    labels: labels,
  };
};

const _getAvgOf = async (Name) => {
  let EnergyData;

  // * Get data from DB
  try {
    EnergyData = await Energy.findAll({
      where: { type: Name },
      order: [["measured_at", "ASC"]],
    });
  } catch (error) {
    console.log(error);
    return new Error("Failed to fetch DB.");
  }

  // * Check if there is enough data and
  if (EnergyData.length < 2) {
    return new Error("Not enough data available.");
  }

  const average = __getAverage(EnergyData);

  return average;
};

module.exports = {
  _createSumaryOf,
  _getAvgExpensesOf,
  _getAvgOf,
};
