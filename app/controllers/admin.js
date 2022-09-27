const User = require("../models/user");
const Role = require("../models/role");
const Energy = require("../models/energy");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");

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
