const User = require("../models/user");
const Unit = require("../models/units");
const Role = require("../models/role");
const Service = require("../models/service");
const Energy = require("../models/energy");
const Payment = require("../models/payment");
const Room = require("../models/room");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");

// ! ADMIN PAYMENT CONTROLLERS
exports.getAllPayments = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Payment.findAll();
    })
    .then((payments) => {
      return res.status(200).json({
        count: 1,
        message: `All payments found.`,
        data: payments,
      });
    })
    .catch((err) => {
      console.error(err.message);
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.createPayment = (req, res) => {
  const { name, iban, currency, isDefault } = req.body;

  let PAYMENT_MODEL;

  try {
    PAYMENT_MODEL = {
      user: name,
      iban: iban,
      currency: currency,
      isDefault: isDefault,
    };
    console.log(PAYMENT_MODEL);
  } catch (error) {
    return res.status(400).end("All parameters are required!");
  }

  sequelize
    .sync()
    .then(() => {
      return Payment.create(PAYMENT_MODEL);
    })
    .then((payment) => {
      return res.status(200).json({
        count: 1,
        message: `Payment created.`,
        data: payment,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).end("Server side error - " + err.message);
    });
};

exports.deletePayment = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Payment.destroy({ where: { user: req.params.name } });
    })
    .then((room) => {
      return res.status(200).json({
        count: 1,
        message: `Payment removed.`,
        data: room,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

exports.updatePayment = (req, res) => {
  const { name, iban, currency, isDefault } = req.body;

  sequelize
    .sync()
    .then(() => {
      return Payment.findOne({
        where: {
          user: req.params.name,
        },
      });
    })
    .then(async (payment) => {
      payment.user = name ? name : payment.user;
      payment.iban = iban ? iban : payment.iban;
      payment.currency = currency ? currency : payment.currency;
      payment.isDefault = isDefault === "on" ? true : false;
      payment.save();
      return payment;
    })
    .then((payment) => {
      return res.status(200).json({
        count: 1,
        message: `Payment updated.`,
        data: payment,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};

// ! ADMIN USERS CONTROLLERS
exports.registerUser = async (req, res) => {
  const { user, pwd, email, contact, age, work, isAdmin, room } = req.body;
  console.log(req.body);
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
      if (room !== undefined) {
        const foundRoom = await Room.findOne({ where: { name: room } });
        await foundRoom.addUser(user);
      }

      const role = await user.createRole({ roleName: "User" });
      if (isAdmin) {
        roleAdmin = await user.createRole({ roleName: "Admin" });
        await user.addRole(roleAdmin);
      }
      return user.addRole(role);
    })
    .then(() => {
      res.status(200).send("User created successfully!");
    })
    .catch((err) => {
      res.status(400).end("Server side error: " + err.message);
      console.log(err);
    });
};

exports.createAdmin = async () => {
  // * Hash the password
  const hashedPwd = await bcrypt.hash(admin, 10);

  // * Create user model
  const USER_MODEL = {
    username: "Admin",
    email: "samo.sipikal@gmail.com",
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
  const input = req.body;
  let count;
  let USER_MODEL;

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
    .then((user) => {
      return (USER_MODEL = {
        username: input?.user ? input.user : user.username,
        email: input?.email ? input.email : user.email,
        password: input?.pwd ? input.password : user.password,
        contact: input?.contact ? input.contact : user.contact,
        age: input?.age ? input.age : user.age,
        work: input?.work ? input.work : user.work,
        isAdmin: input?.isAdmin ? input.isAdmin : user.isAdmin,
      });
    })
    .then(() => {
      return User.update(USER_MODEL, {
        where: {
          username: req.params.username,
        },
      });
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

exports.createRoom = (req, res) => {
  const { name, accommodated } = req.body;

  let ROOM_MODEL;

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
    .then((energy) => {
      return res.status(200).json({
        count: 1,
        message: `Room created.`,
        data: energy,
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
  const { name } = req.body;

  sequelize
    .sync()
    .then(() => {
      return Room.findOne({
        where: {
          name: req.params.name,
        },
      });
    })
    .then(async (room) => {
      if (req.body.users) {
        const user = await User.findOne({
          where: { username: req.body.users },
        });
        room.addUser(user);
        room.save();
      }
      room.name = name ? name : room.name;
      room.save();
      return room;
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
  console.log(req.body);
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
  console.log(ENERGY_MODEL);
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
      return res.status(500).end("Measured value and type can't be empty.");
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
    .then((energy) => {
      const ENERGY_MODEL = {
        type: type ? type : energy.type,
        measured_value: measured ? measured : energy.measured_value,
        measured_at: date ? date : energy.measured_at,
      };

      return Energy.update(ENERGY_MODEL, {
        where: {
          id: req.params.id,
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: 1,
        message: `Record updated.`,
        data: event,
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
  const input = req.body;

  sequelize
    .sync()
    .then(() => {
      return Service.findOne({
        where: {
          id: req.params.id,
        },
      });
    })
    .then((service) => {
      const SERVICE_MODEL = {
        name: input.name ? input.name : service.name,
        monthly_price: input.monthly_price
          ? input.monthly_price
          : service.monthly_price,
        pay_day: input.pay_day ? input.pay_day : service.pay_day,
      };

      return Service.update(SERVICE_MODEL, {
        where: {
          id: req.params.id,
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: 1,
        message: `Service updated.`,
        data: event,
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
  const input = req.body;
  console.log(input);
  sequelize
    .sync()
    .then(() => {
      return Unit.findOne({
        where: {
          id: req.params.id,
        },
      });
    })
    .then((unit) => {
      const SERVICE_MODEL = {
        name: input.name ? input.name : unit.name,
        unit_price: input.unit_price ? input.unit_price : unit.unit_price,
        unit: input.unit ? input.unit : unit.unit,
      };

      return Unit.update(SERVICE_MODEL, {
        where: {
          id: req.params.id,
        },
      });
    })
    .then((event) => {
      return res.status(200).json({
        count: 1,
        message: `Unit updated.`,
        data: event,
      });
    })
    .catch((err) => {
      return res.status(500).end("Server side error: " + err.message);
    });
};
