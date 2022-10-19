const Product = require("../models/product");
const User = require("../models/user");
const sequelize = require("../util/database");
const mailer = require("../emails/sendMail.js");
const productModel = require("../emails/models/newProduct");
require("dotenv").config();

exports.getAll = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Product.findAll();
    })
    .then((products) => {
      return res.status(200).json({
        count: products.length,
        message: `All products found.`,
        data: products,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.createOne = (req, res) => {
  let count;
  const { name, type, price, owner, priority } = req.body;
  const PRODUCT_MODEL = {
    name: name ? name : "Product",
    type: type ? type : "Unknown",
    price: price ? price : 0,
    ownership: owner !== undefined ? owner : "every",
    urgent: priority ? priority : "LOW",
  };
  sequelize
    .sync()
    .then(async () => {
      const users = await User.findAll();
      const emails = users.map((user) => user.email);
      const message_info = {
        send_to: emails,
        subject: "🔥 Shopping Card",
      };
      if (process.env.SEND_MAILS === "true") {
        mailer(productModel, message_info, PRODUCT_MODEL);
      }
    })
    .then(() => {
      return Product.create(PRODUCT_MODEL);
    })
    .then((product) => {
      return res.status(200).json({
        count: count,
        message: `Product created.`,
        data: product,
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
      return Product.destroy({ where: { id: parseInt(req.params.id) } });
    })
    .then((product) => {
      return res.status(200).json({
        count: product.length,
        message: `Product of ${req.params.email} with id: ${req.params.id} done/deleted.`,
        data: product,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.updateOne = (req, res) => {
  const { name, type, price, owner, priority } = req.body;
  sequelize
    .sync()
    .then(() => {
      return Product.findOne({
        where: { id: req.params.id },
      });
    })
    .then((product) => {
      model = {
        name: name ? name : product.name,
        type: type ? type : product.type,
        price: price ? price : product.price,
        ownership: owner ? owner : product.ownership,
        urgent: priority ? priority : product.urgent,
      };
      return product.update(model);
    })
    .then((product) => {
      return res.status(200).json({
        count: 1,
        message: `Product of ${req.params.email} with id: ${req.params.id} was changed.`,
        data: product,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};
