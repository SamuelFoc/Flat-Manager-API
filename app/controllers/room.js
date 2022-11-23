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
  // Get all neccessary info about Flat
  const rooms = await Room.findAll();
  const users = await User.findAll();
  const services = await Service.findAll();

  // Get all neccessary info about Room
  const room = await Room.findOne({ where: { name: req.params.name } });
  let residents = await room.getUsers();
  const me = residents[0];
  residents = residents.map((user) => user.username);

  // Get usefull numbers to compute individual rents
  const flat_residents = users.length;
  const rooms_in_flat = rooms.length;
  const room_residents = residents.length;

  // Get room costs for every service
  const services_on_room = services
    .map((service) => {
      const result = room_residents * (service.monthly_price / flat_residents);
      return {
        name: service.name,
        price: result.toFixed(2),
      };
    })
    .filter((service) => service.name !== "Rent");

  // Get Rent cost for every room
  const rent = services.find(
    (service) => service.name === "Rent"
  )?.monthly_price;
  const rent_on_room = rent / rooms_in_flat;

  // How many services are paid by me and how much I paid in total
  const my_services = await me.getServices();
  const my_services_full = my_services.map((service) => ({
    name: service.name,
    price: service.monthly_price,
  }));
  const paid_by_me = my_services
    .map((service) => service.monthly_price)
    .reduce((sum, value) => sum + value, 0);

  // How much should I pay on services in total
  const should_pay_on_services = services_on_room
    .map((item) => +item.price)
    .reduce((a, b) => a + b, 0);

  // How big are my overpayments or arrears
  const arrears = should_pay_on_services - paid_by_me;

  // Rent plus arrears together
  const total_rent = rent_on_room + arrears;

  const response = {
    room: room.name,
    livings: room_residents,
    living_names: residents,
    units: services_on_room,
    units_total: should_pay_on_services.toFixed(2),
    my_units: my_services_full,
    units_paid_by_me: paid_by_me.toFixed(2),
    arrears: arrears.toFixed(2),
    rent: rent_on_room.toFixed(2),
    cost: total_rent.toFixed(2),
    paid_on: room.paid_on,
  };

  res.status(200).json(response);
};
