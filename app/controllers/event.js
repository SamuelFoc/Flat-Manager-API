const Event = require("../models/event");
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
      return user.getEvents();
    })
    .then((events) => {
      return res.status(200).json({
        count: events.length,
        message: `All events of ${req.params.email} found.`,
        data: events,
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
      return user.getEvents({
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: 1,
        message: `Event of ${req.params.email} with id: ${req.params.id} found.`,
        data: event,
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

  const EVENT_MODEL = {
    title: input.title ? input.title : "Event",
    description: input.description
      ? input.description
      : "No description given by author.",
    event_date: input.event_date
      ? input.event_date
      : tomorrow.setDate(tomorrow.getDate() + 1),
    invited_number: input.invited_number ? input.invited_number : 0,
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
    .then((user) => {
      count = user.getEvents().length;
      return user.createEvent(EVENT_MODEL);
    })
    .then((event) => {
      return res.status(200).json({
        count: count,
        message: `Event created.`,
        data: event,
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
      const event = await Event.findOne({
        where: { id: parseInt(req.params.id) },
      });
      await user.removeEvent(event);
      return await Event.destroy({
        where: {
          id: parseInt(req.params.id),
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: event.length,
        message: `Event of ${req.params.email} with id: ${req.params.id} done/deleted.`,
        data: event,
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
      return Event.findOne({
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((event) => {
      return {
        title: input.title ? input.title : event.title,
        description: input.description ? input.description : event.description,
        event_date: input.event_date ? input.event_date : event.event_date,
        invited_number: input.invited_number
          ? input.invited_number
          : event.invited_number,
      };
    })
    .then((resp_model) => {
      return Event.update(resp_model, {
        where: {
          [Op.and]: [{ userEmail: req.params.email }, { id: req.params.id }],
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: 1,
        message: `Event of ${req.params.email} with id: ${req.params.id} was changed.`,
        data: event,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};
