const Room = require("../models/room");
const sequelize = require("../util/database");
const Portal = require("../util/dbPortal");

const portal = new Portal(Room, sequelize);

exports.getAll = (req, res) => {
  portal.getAll(req, res);
};

exports.getOne = (req, res) => {
  portal.getOne(req, res);
};

exports.createOne = (req, res) => {
  const input = req.body;
  const roomModel = {
    name: input.name ? input.name : new Error("Name is required!"),
    number_of_livings: input.number_of_livings ? input.number_of_livings : 1,
  };
  portal.createOne(req, res, roomModel);
};

exports.updateOne = (req, res) => {
  const input = req.body;
  const roomModel = {
    name: input.name,
    number_of_livings: input.number_of_livings,
  };
  portal.updateOne(req, res, roomModel);
};

exports.deleteOne = (req, res) => {
  portal.deleteOne(req, res);
};
