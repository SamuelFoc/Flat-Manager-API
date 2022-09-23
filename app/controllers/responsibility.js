const Responsibility = require("../models/responsibility");
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
      return user.getResponsibilities();
    })
    .then((responsibilities) => {
      return res.status(200).json({
        count: responsibilities.length,
        message: `All responsibilities of ${req.params.email} found.`,
        data: responsibilities,
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
      return user.getResponsibilities({
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((responsibility) => {
      return res.status(200).json({
        count: 1,
        message: `Responsibility of ${req.params.email} with id: ${req.params.id} found.`,
        data: responsibility,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.createOne = (req, res) => {
  let count;
  const input = req.body;
  var tomorrow = new Date();

  const RESPONSIBILITY_MODEL = {
    title: input.title ? input.title : "Responsibility",
    description: input.description
      ? input.description
      : "No descripition given by author.",
    deadline: input.deadline
      ? input.deadline
      : tomorrow.setDate(tomorrow.getDate() + 1),
    done: input.done ? input.done : false,
    urgent: input.priority,
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
      count = user.getResponsibilities().length;
      return user.createResponsibility(RESPONSIBILITY_MODEL);
    })
    .then((responsibility) => {
      return res.status(200).json({
        count: count,
        message: `Responsibility created.`,
        data: responsibility,
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
      const responsibility = await Responsibility.findOne({
        where: { id: parseInt(req.params.id) },
      });
      await user.removeResponsibility(responsibility);
      return await Responsibility.destroy({
        where: {
          id: parseInt(req.params.id),
        },
      });
    })
    .then((responsibility) => {
      return res.status(200).json({
        count: responsibility.length,
        message: `Responsibility of ${req.params.email} with id: ${req.params.id} done/deleted.`,
        data: responsibility,
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
      return Responsibility.findOne({
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((responsibility) => {
      return {
        title: input.title ? input.title : responsibility.title,
        description: input.description
          ? input.description
          : responsibility.description,
        deadline: input.deadline ? input.deadline : responsibility.deadline,
        done: input.done ? input.done : responsibility.done,
        urgent: input.priority ? input.priority : responsibility.urgent,
      };
    })
    .then((resp_model) => {
      return Responsibility.update(resp_model, {
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((responsibility) => {
      return res.status(200).json({
        count: 1,
        message: `Responsibility of ${req.params.email} with id: ${req.params.id} was changed.`,
        data: responsibility,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};
