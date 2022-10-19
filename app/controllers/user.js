const User = require("../models/user");
const sequelize = require("../util/database");

exports.getAll = (req, res) => {
  let count;
  sequelize
    .sync()
    .then(async () => {
      count = await User.count();
      return User.findAll();
    })
    .then((users) => {
      return res.status(200).json({
        count: count,
        message: `All users found.`,
        data: users,
      });
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};

exports.getOne = async (req, res) => {
  let count;
  sequelize
    .sync()
    .then(async () => {
      count = await User.count();
      return User.findOne({
        where: {
          email: req.params.email,
        },
      });
    })
    .then((user) => {
      if (user) {
        return res.status(200).json({
          count: count,
          message: `User ${user.username} found.`,
          data: user,
        });
      } else {
        throw new Error("User not found.");
      }
    })
    .catch((err) => {
      return res.status(500).json({ ERROR: err.message });
    });
};
