const Room = require("../models/room");
const User = require("../models/user");
const Service = require("../models/service");
const sequelize = require("../util/database");
const Portal = require("../util/dbPortal");

const portal = new Portal(Room, sequelize);

exports.getAll = (req, res) => {
  portal.getAll(req, res);
};

exports.getOne = async (req, res) => {
  const rooms = await Room.findAll();
  const users = await User.findAll();
  const room = await Room.findOne({ where: { name: req.params.name } });
  const services = await Service.findAll();
  const livings = await room.getUsers();

  const numberOfLivings = users.length;
  const numberOfRooms = rooms.length;
  const numberOfRoomLivings = livings.length;
  const unit_costs = services.map((service) => {
    const name = service.name;
    const price = service.monthly_price;
    if (name === "Rent") {
      const result = price / numberOfRooms;
      return {
        name: name,
        price: result,
      };
    } else {
      const result = numberOfRoomLivings * (price / numberOfLivings);
      return {
        name: name,
        price: result,
      };
    }
  });

  let sums = [];
  let costs = unit_costs.map((item) => item.price);
  costs = costs.reduce((a, b) => a + b, 0);

  const response = {
    room: room.name,
    livings: numberOfRoomLivings,
    units: unit_costs,
    cost: costs,
  };

  res.status(200).json(response);
};

exports.createOne = (req, res) => {
  const { name, outcomes, payDay } = req.body;
  const roomModel = {
    name: name ? name : new Error("Name is required!"),
    outcomes: outcomes ? outcomes : [],
    pay_day: payDay ? payDay : 14,
    paid_on: null,
  };
  portal.createOne(req, res, roomModel);
};

exports.updateOne = (req, res) => {
  const { name, outcomes, payDay, paidOn } = req.body;
  const roomModel = {
    name: name ? name : null,
    outcomes: outcomes ? outcomes : null,
    pay_day: payDay ? payDay : null,
    paid_on: paidOn ? paidOn : null,
  };
  portal.updateOne(req, res, roomModel);
};

exports.addUser = async (req, res) => {
  const { username, roomname } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });
    const room = await Room.findOne({ where: { name: roomname } });
    room.addUser(user);
    res.status(200).json("User added");
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.deleteOne = (req, res) => {
  portal.deleteOne(req, res);
};
