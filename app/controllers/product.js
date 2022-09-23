const Product = require("../models/product");
const { Op } = require("sequelize");
const User = require("../models/user");
const sequelize = require("../util/database");

exports.getAll = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return User.findOne({ where: { email: req.params.email } });
    })
    .then((user) => {
      return user.getProducts();
    })
    .then((products) => {
      return res.status(200).json({
        count: products.length,
        message: `All products of ${req.params.email} found.`,
        data: products,
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
      return User.findOne({ where: { email: req.params.email } });
    })
    .then((user) => {
      return user.getProducts({
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((product) => {
      return res.status(200).json({
        count: 1,
        message: `Product of ${req.params.email} with id: ${req.params.id} found.`,
        data: product,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.createOne = (req, res) => {
  let count;
  const input = req.body;
  const PRODUCT_MODEL = {
    name: input.name ? input.name : "Product",
    type: input.type ? input.type : new Error("Type is required!"),
    price: input.price ? input.price : 0,
    ownership: input.ownership === "true" ? req.params.email : "every",
    urgent: input.priority ? input.priority : "LOW",
  };

  sequelize
    .sync()
    .then(() => {
      return User.findOne({
        where: {
          email: req.params.email,
        },
      });
    })
    .then(async (user) => {
      count = user.getProducts().length;
      return user.createProduct(PRODUCT_MODEL);
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
      return User.findOne({ where: { email: req.params.email } });
    })
    .then(async (user) => {
      const product = await Product.findOne({
        where: { id: parseInt(req.params.id) },
      });
      await user.removeProduct(product);
      return await Product.destroy({
        where: {
          id: parseInt(req.params.id),
        },
      });
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
  const input = req.body;

  sequelize
    .sync()
    .then(() => {
      return Product.findOne({
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((product) => {
      return {
        name: input.name ? input.name : product.name,
        type: input.type ? input.type : product.type,
        price: input.price ? input.price : product.price,
        ownership: input.ownership ? input.ownership : product.ownership,
        urgent: input.priority ? input.priority : product.urgent,
      };
    })
    .then((resp_model) => {
      return Product.update(resp_model, {
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
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
