const Product = require("../models/product");
const { Op } = require("sequelize");
const User = require("../models/user");
const sequelize = require("../util/database");

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

exports.getMyAll = (req, res) => {
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
  const { name, type, price, owner, priority } = req.body;
  const PRODUCT_MODEL = {
    name: name ? name : "Product",
    type: type ? type : new Error("Type is required!"),
    price: price ? price : 0,
    ownership: owner !== "" ? owner : "every",
    urgent: priority ? priority : "LOW",
  };
  console.log(PRODUCT_MODEL);
  sequelize
    .sync()
    // .then(() => {
    //   return User.findOne({
    //     where: {
    //       email: req.params.email,
    //     },
    //   });
    // })
    // .then(async (user) => {
    //   count = user.getProducts().length;
    //   return user.createProduct(PRODUCT_MODEL);
    // })
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
    // .then(() => {
    //   return User.findOne({ where: { email: req.params.email } });
    // })
    // .then(async (user) => {
    //   const product = await Product.findOne({
    //     where: { id: parseInt(req.params.id) },
    //   });
    //   await user.removeProduct(product);
    //   return await Product.destroy({
    //     where: {
    //       id: parseInt(req.params.id),
    //     },
    //   });
    // })
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
