const User = require("../models/user");
const Unit = require("../models/units");
const Role = require("../models/role");
const Service = require("../models/service");
const Energy = require("../models/energy");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");

// ! ADMIN USERS CONTROLLERS
exports.registerUser = async (req, res) => {
  const { user, pwd, email, contact, age, work, isAdmin, room } = req.body;

  // * Check for required parameters
  if (!user || !pwd || !email)
    return res
      .status(400)
      .json({ message: "Username, email and passsword required!" });

  // * Check if user already exists
  const userExists = await User.findOne({
    where: { username: user },
  });
  if (userExists)
    return res.status(409).send("User with that name already exists!");

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
      console.log("Room created");
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
      res.status(400).send(err);
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
    });
};

// ! ADMIN ENERGIES CONTROLLERS
exports.getAllEnergies = (req, res) => {
  sequelize
    .sync()
    .then(() => {
      return Energy.findAll();
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
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
        type: input.type ? input.type : service.type,
        monthly_price: input.monthly_price
          ? input.monthly_price
          : service.monthly_price,
        start_date: input.start_date ? input.start_date : service.start_date,
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
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
      return res.status(500).json({ ERROR: err.message });
    });
};
