const fs = require("fs");
const { Op } = require("sequelize");
const PDFDocument = require("./library/pdf-kit-tables");
const stats = require("./library/statisticsBox");
const Energy = require("../models/energy");

const createConsumptionReportOf = async (type, _from, _to) => {
  const data = await Energy.findAll({
    where: {
      [Op.and]: [
        { type: type },
        {
          measured_at: {
            [Op.between]: [_from, _to],
          },
        },
      ],
    },
    order: [["measured_at", "DESC"]],
  });
  const summaryData = await stats._createSumaryOf(type);
  const firstMeassure = data[data.length - 1].measured_at;
  const lastMeassure = data[0].measured_at;
  const from = new Date(_from);
  const to = new Date(_to);

  let unit;
  if (type === "Electricity") {
    unit = "kWh";
  } else {
    unit = "m3";
  }

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(`${__dirname}/documents/${type}_report.pdf`));

  doc
    .image(`${__dirname}/logo.png`, 50, 50, { width: 50 })
    .fillColor("black")
    .fontSize(25)
    .text(`${type} report`, 110, 57)
    .fontSize(10)
    .text("Flat Manager App", 200, 65, { align: "right" })
    .text("Created: " + new Date().toLocaleDateString("en-GB"), 200, 80, {
      align: "right",
    })
    .moveDown();

  //SUMMARY
  const sumX = 50;
  const sumY = 150;
  doc
    .fontSize(12)
    .text(`Days: ${summaryData.days}`, sumX, sumY)
    .text(`Total: ${summaryData.real_consumption}`, sumX, sumY + 20)
    .text(`Inkaso: ${summaryData.predictedPrice}`, sumX, sumY + 40)
    .text(`Real: ${summaryData.real_consumption_price}`, sumX + 150, sumY)
    .text(`Overpayment: ${summaryData.overpayments}`, sumX + 150, sumY + 20)
    .text(`Arrears: ${summaryData.arrears}`, sumX + 150, sumY + 40);

  //TABLE
  const table = {
    headers: ["Measured values", "Measured at"],
    rows: [],
  };

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  data.forEach((record) => {
    const date = new Date(record.measured_at);
    const measured = record.measured_value + " " + unit;
    table.rows.push([measured, date.toLocaleDateString("en-GB", options)]);
  });

  doc.moveDown().table(table, sumX, sumY + 150, { width: 500 });

  //FOOTER
  doc
    .moveDown()
    .fontSize(12)
    .text(
      `This report contains ${type.toLowerCase()} data from ${from.toLocaleDateString(
        "en-GB"
      )} to ${to.toLocaleDateString("en-GB")}`,
      50,
      doc.page.height - 100,
      {
        width: 500,
        align: "center",
        lineBreak: false,
      }
    );

  doc.end();
};

module.exports = {
  createConsumptionReportOf,
};
