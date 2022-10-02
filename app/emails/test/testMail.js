const mailer = require("../sendMail.js");
const productModel = require("../models/newProduct");
const userModel = require("../models/newUser");
const featureModel = require("../models/newFeature");
const energyModel = require("../models/newEnergy");

const message_info = {
  send_to: "tomino.dendis@gmail.com",
  subject: "🔥 Shopping Card",
};

const product_info = {
  name: "Toilet paper",
  price: 35,
  priority: "LOW",
};

mailer(productModel, message_info, product_info);
