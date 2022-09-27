const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcrypt");
const sequelize = require("./database");

const createAdmin = async () => {
  // * Hash the password
  const hashedPwd = await bcrypt.hash("admin", 10);

  // * Create user model
  const USER_MODEL = {
    username: "Admin",
    email: "samo.sipikal@gmail.com",
    password: hashedPwd,
    contact: "Unknown",
    age: 99,
    work: "Unknown",
    isAdmin: true,
  };

  // * Create user
  sequelize.sync({ alter: true }).then(() => {
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
  });
};

createAdmin();
