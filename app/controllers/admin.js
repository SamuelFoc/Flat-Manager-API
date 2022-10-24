const User = require("../models/user");
const Unit = require("../models/units");
const Role = require("../models/role");
const Service = require("../models/service");
const Energy = require("../models/energy");
const PaymentAccount = require("../models/paymentAccount");
const Room = require("../models/room");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");
require("dotenv").config();

// ! ADMIN PAYMENT CONTROLLERS
exports.getAllPaymentAccounts = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return PaymentAccount.findAll();
    })
    .then((paymentAccounts) => {
      return res.status(200).json({
        count: 1,
        message: `All payments found.`,
        data: paymentAccounts,
      });
    })
    .catch((err) => {
      console.error(err.message);
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.createPaymentAccount = (req, res) => {
  const { name, iban, currency, isDefault } = req.body;

  let PAYMENT_ACCOUNT_MODEL;

  try {
    PAYMENT_ACCOUNT_MODEL = {
      user: name,
      iban: iban,
      currency: currency,
      isDefault: isDefault,
    };
  } catch (error) {
    return res.status(400).end("All parameters are required!");
  }

  sequelize
    .sync()
    .then(() => {
      return PaymentAccount.create(PAYMENT_ACCOUNT_MODEL);
    })
    .then((paymentAccount) => {
      return res.status(200).json({
        count: 1,
        message: `Payment account created.`,
        data: paymentAccount,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).end("Server side error - " + err.message);
    });
};

exports.deletePaymentAccount = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return PaymentAccount.destroy({ where: { user: req.params.name } });
    })
    .then((room) => {
      return res.status(200).json({
        count: 1,
        message: `PaymentAccount removed.`,
        data: room,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.updatePaymentAccount = (req, res) => {
  const { name, iban, currency, isDefault } = req.body;

  sequelize
    .sync()
    .then(() => {
      return PaymentAccount.findOne({
        where: {
          user: req.params.name,
        },
      });
    })
    .then((_paymentAccount) => {
      _paymentAccount.user = name ? name : _paymentAccount.user;
      _paymentAccount.iban = iban ? iban : _paymentAccount.iban;
      _paymentAccount.currency = currency ? currency : _paymentAccount.currency;
      _paymentAccount.isDefault = isDefault === "on" ? true : false;
      _paymentAccount.save();
      return _paymentAccount;
    })
    .then((paymentAccount) => {
      return res.status(200).json({
        count: 1,
        message: `Payment account updated.`,
        data: paymentAccount,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

// ! ADMIN USERS CONTROLLERS
exports.registerUser = async (req, res) => {
  const { user, pwd, email, contact, age, work, isAdmin, room } = req.body;
  // * Check for required parameters
  if (!user || !pwd || !email)
    return res.status(400).end("Username, email and passsword required!");

  // * Check if user already exists
  const userExists = await User.findOne({
    where: { username: user },
  });
  if (userExists)
    return res.status(409).end("User with that name already exists!");

  // * Hash the password
  const hashedPwd = await bcrypt.hash(pwd, 10);
  // * Create user model
  const USER_MODEL = {
    username: user,
    email: email,
    password: hashedPwd,
    contact: contact ? contact : "Unknown",
    age: age ? age : null,
    work: work ? work : "Student",
    isAdmin: isAdmin === "on" ? true : false,
  };

  // * Create user
  User.create(USER_MODEL)
    .then(async (user) => {
      const role = await user.createRole({ roleName: "User" });
      if (isAdmin) {
        roleAdmin = await user.createRole({ roleName: "Admin" });
        await user.addRole(roleAdmin);
      }
      return user.addRole(role);
    })
    .then(async (user) => {
      if (room) {
        const roomDB = await Room.findOne({ where: { name: room } });
        roomDB.addUser(user);
      }
      res.status(200).json({
        message: "User created succesfully",
        user: user,
      });
    })
    .catch((err) => {
      res.status(500).end("Server side error: " + err.message);
      console.log(err);
    });
};

exports.createAdmin = async () => {
  // * Hash the password
  const hashedPwd = await bcrypt.hash(admin, 10);

  // * Create user model
  const USER_MODEL = {
    username: "Admin",
    email: process.env.EMAIL_ADDRESS,
    password: hashedPwd,
    contact: "Unknown",
    age: null,
    work: "Unknown",
    isAdmin: true,
  };

  // * Create user
  User.create(USER_MODEL)
    .then(async (user) => {
      const role = await user.createRole({ roleName: "Admin" });
      return user.addRole(role);
    })
    .then(() => {
      console.log("Admin created successfully!");
      console.table({
        username: "Admin",
        email: "samo.sipikal@gmail.com",
        password: "admin",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.deleteUser = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return User.destroy({ where: { username: req.params.username } });
    })
    .then((user) => {
      return res.status(200).json({
        count: 1,
        message: `User ${req.params.username} removed.`,
        data: user,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.getAllUsers = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return User.findAll();
    })
    .then((users) => {
      return res.status(200).json({
        count: 1,
        message: `All users found.`,
        data: users,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.updateUser = async (req, res) => {
  const { user, email, pwd, contact, age, work, isAdmin } = req.body;
  let count;
  sequelize
    .sync()
    .then(async () => {
      count = await User.count();
      return User.findOne({
        where: {
          username: req.params.username,
        },
      });
    })
    .then((_user) => {
      _user.username = user ? input.user : _user.username;
      _user.email = email ? input.email : _user.email;
      _user.password = pwd ? input.password : _user.password;
      _user.contact = contact ? input.contact : _user.contact;
      _user.age = age ? input.age : _user.age;
      _user.work = work ? input.work : _user.work;
      _user.isAdmin = isAdmin ? input.isAdmin : _user.isAdmin;
      _user.save();
      return _user;
    })
    .then((user) => {
      return res.status(200).json({
        count: count,
        message: "User updated successfully.",
        data: user,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

// ! ADMIN ROOMS CONTROLLERS
exports.getAllRooms = (req, res) => {
  let roomUsers = [];
  sequelize
    .sync()
    .then(async () => {
      const rooms = await Room.findAll();

      for (const room of rooms) {
        const users = await room.getUsers();
        roomUsers.push({ users: users, room: room });
      }

      return roomUsers;
    })
    .then((rooms) => {
      return res.status(200).json({
        count: rooms.length,
        message: `All rooms found.`,
        data: rooms,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.createRoom = async (req, res) => {
  const { name, users } = req.body;

  let ROOM_MODEL;

  const roomExists = await Room.findOne({
    where: { name: name },
  });
  if (roomExists)
    return res.status(409).end("Room with that name already exists!");

  try {
    ROOM_MODEL = {
      name: name,
    };
  } catch (error) {
    return res.status(400).end("Name is required!");
  }

  sequelize
    .sync()
    .then(() => {
      return Room.create(ROOM_MODEL);
    })
    .then(async (room) => {
      if (users) {
        const user = await User.findOne({ where: { username: users } });
        room.addUser(user);
      }
      return res.status(200).json({
        count: 1,
        message: `Room created.`,
        data: room,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error.");
    });
};

exports.deleteRoom = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Room.destroy({ where: { name: req.params.name } });
    })
    .then((room) => {
      return res.status(200).json({
        count: 1,
        message: `Room removed.`,
        data: room,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.updateRoom = (req, res) => {
  const { name, paidOn } = req.body;

  sequelize
    .sync()
    .then(() => {
      return Room.findOne({
        where: {
          name: req.params.name,
        },
      });
    })
    .then(async (_room) => {
      if (req.body.users) {
        const user = await User.findOne({
          where: { username: req.body.users },
        });
        _room.addUser(user);
        _room.save();
      }
      _room.name = name ? name : _room.name;
      _room.paid_on = paidOn ? paidOn : _room.name;
      _room.save();
      return _room;
    })
    .then((room) => {
      return res.status(200).json({
        count: 1,
        message: `Room updated.`,
        data: room,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
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

// ! ADMIN ENERGIES CONTROLLERS
exports.getAllEnergies = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Energy.findAll({ order: [["measured_at", "DESC"]] });
    })
    .then((energies) => {
      const water = energies.filter(
        (energy) => energy.type.toLowerCase() === "water"
      );
      const gas = energies.filter(
        (energy) => energy.type.toLowerCase() === "gas"
      );
      const electricity = energies.filter(
        (energy) => energy.type.toLowerCase() === "electricity"
      );
      return res.status(200).json({
        count: energies.length,
        message: `All energies found.`,
        data: {
          gas: gas,
          water: water,
          electricity: electricity,
        },
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.createEnergy = (req, res) => {
  const { type, measured, date } = req.body;
  let ENERGY_MODEL;

  try {
    ENERGY_MODEL = {
      type: type,
      measured_value: measured,
      measured_at: date ? date : new Date(),
    };
  } catch (error) {
    return res.status(400).end("Measured value and type is required!");
  }

  sequelize
    .sync()
    .then(() => {
      return Energy.create(ENERGY_MODEL);
    })
    .then((energy) => {
      return res.status(200).json({
        count: 1,
        message: `Measured value has been written.`,
        data: energy,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .end("Measured value and type can't be empty.", err.message);
    });
};

exports.deleteEnergy = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Energy.destroy({ where: { id: req.params.id } });
    })
    .then((energy) => {
      return res.status(200).json({
        count: 1,
        message: `Enery record removed.`,
        data: energy,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.updateEnergy = (req, res) => {
  const { type, measured, date } = req.body;

  sequelize
    .sync()
    .then(() => {
      return Energy.findOne({
        where: {
          id: req.params.id,
        },
      });
    })
    .then((_energy) => {
      _energy.type = type ? type : _energy.type;
      _energy.measured_value = measured ? measured : _energy.measured_value;
      _energy.measured_at = date ? date : _energy.measured_at;
      _energy.save();
      return _energy;
    })
    .then((energy) => {
      return res.status(200).json({
        count: 1,
        message: `Consumption record updated.`,
        data: energy,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

// ! ADMIN SERVICES CONTROLLERS
exports.getAllServices = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Service.findAll();
    })
    .then((services) => {
      return res.status(200).json({
        count: 1,
        message: `All services found.`,
        data: services,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.createService = (req, res) => {
  const { name, monthly_price, pay_day } = req.body;

  const SERVICE_MODEL = {
    name: name ? name : new Error("Name is required!"),
    monthly_price: monthly_price ? monthly_price : 0,
    pay_day: pay_day ? pay_day : 15,
  };

  sequelize
    .sync()
    .then(() => {
      return Service.create(SERVICE_MODEL);
    })
    .then((service) => {
      return res.status(200).json({
        count: 1,
        message: `Service has been recorded.`,
        data: service,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.deleteService = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Service.destroy({ where: { id: req.params.id } });
    })
    .then((service) => {
      return res.status(200).json({
        count: 1,
        message: `Service removed.`,
        data: service,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.updateService = (req, res) => {
  const { name, monthly_price, pay_day } = req.body;

  sequelize
    .sync()
    .then(() => {
      return Service.findOne({
        where: {
          id: req.params.id,
        },
      });
    })
    .then((_service) => {
      _service.name = name ? name : _service.name;
      _service.monthly_price = monthly_price
        ? monthly_price
        : _service.monthly_price;
      _service.pay_day = pay_day ? pay_day : _service.pay_day;
      _service.save();
      return _service;
    })
    .then((service) => {
      return res.status(200).json({
        count: 1,
        message: `Service updated.`,
        data: service,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

// ! ADMIN UNITS CONTROLLERS
exports.createUnit = (req, res) => {
  const { name, unit_price, unit } = req.body;

  const UNIT_MODEL = {
    name: name ? name : new Error("Name is required!"),
    unit_price: unit_price ? unit_price : 0,
    unit: unit ? unit : "m3",
  };

  sequelize
    .sync()
    .then(() => {
      return Unit.create(UNIT_MODEL);
    })
    .then((unit) => {
      return res.status(200).json({
        count: 1,
        message: `Unit has been recorded.`,
        data: unit,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.getAllUnits = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Unit.findAll();
    })
    .then((units) => {
      return res.status(200).json({
        count: units?.length,
        message: `All units found.`,
        data: units,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.deleteUnit = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Unit.destroy({ where: { id: req.params.id } });
    })
    .then((unit) => {
      return res.status(200).json({
        count: 1,
        message: `Unit removed.`,
        data: unit,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.updateUnit = (req, res) => {
  const { name, unit_price, unit } = req.body;
  sequelize
    .sync()
    .then(() => {
      return Unit.findOne({
        where: {
          id: req.params.id,
        },
      });
    })
    .then((_unit) => {
      _unit.name = name ? name : _unit.name;
      _unit.unit_price = unit_price ? unit_price : _unit.unit_price;
      _unit.unit = unit ? unit : _unit.unit;
      _unit.save();
      return _unit;
    })
    .then((unit) => {
      return res.status(200).json({
        count: 1,
        message: `Unit updated.`,
        data: unit,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};
