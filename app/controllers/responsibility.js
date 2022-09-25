const Responsibility = require("../models/responsibility");
const { Op } = require("sequelize");
const User = require("../models/user");
const sequelize = require("../util/database");

exports.getAll = (req, res) => {
  sequelize
    .sync()
    // .then(() => {
    //   return User.findOne({ where: { email: req.params.email } });
    // })
    // .then((user) => {
    //   return user.getResponsibilities();
    // })
    .then(() => {
      return Responsibility.findAll();
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
  const { title, description, deadline, done, priority } = req.body;
  var tomorrow = new Date();

  const RESPONSIBILITY_MODEL = {
    title: title ? title : "Responsibility",
    description: description ? description : "No descripition given by author.",
    deadline: deadline ? deadline : tomorrow.setDate(tomorrow.getDate() + 1),
    done: done ? done : false,
    urgent: priority,
  };

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
    //   count = user.getResponsibilities().length;
    //   return user.createResponsibility(RESPONSIBILITY_MODEL);
    // })
    .then(() => {
      return Responsibility.create(RESPONSIBILITY_MODEL);
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
    // .then(() => {
    //   return User.findOne({ where: { email: req.params.email } });
    // })
    // .then(async (user) => {
    //   const responsibility = await Responsibility.findOne({
    //     where: { id: parseInt(req.params.id) },
    //   });
    //   await user.removeResponsibility(responsibility);
    //   return await Responsibility.destroy({
    //     where: {
    //       id: parseInt(req.params.id),
    //     },
    //   });
    // })
    .then(() => {
      return Responsibility.destroy({ where: { id: req.params.id } });
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
  const { title, description, deadline, done, priority } = req.body;

  sequelize
    .sync()
    // .then(() => {
    //   return Responsibility.findOne({
    //     where: {
    //       [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
    //     },
    //   });
    // })
    .then(() => {
      return Responsibility.findOne({ where: { id: req.params.id } });
    })
    .then((responsibility) => {
      return {
        title: title ? title : responsibility.title,
        description: description ? description : responsibility.description,
        deadline: deadline ? deadline : responsibility.deadline,
        done: done !== undefined ? done : responsibility.done,
        urgent: priority ? priority : responsibility.urgent,
      };
    })
    .then((resp_model) => {
      return Responsibility.update(resp_model, {
        where: {
          id: req.params.id,
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
