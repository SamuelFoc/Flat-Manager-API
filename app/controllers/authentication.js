const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // * Find user in DB
  const foundUser = await User.findOne({
    where: { username: user },
  });
  if (!foundUser) return res.status(400).send("No user with that name!");

  // * Validate user password
  const validPass = await bcrypt.compare(pwd, foundUser.password);
  if (!validPass) return res.status(401).send("Invalid password!");

  // * Find user roles in DB
  const rolesRaw = await foundUser.getRoles({
    attributes: ["roleName"],
    raw: true,
  });
  const roles = rolesRaw.map((role) => Object.values(role)[0]);

  // * Create access and refresh token for specific user and roles
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );

  const refresh_token = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // * Save refresh token to found user
  foundUser.update({ refreshToken: refresh_token });

  // * Set up refresh token to cookies
  res.cookie("jwt", refresh_token, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  // * Send access token and roles to the Frontend
  res.json({ accessToken, roles });
};

module.exports = {
  login,
};
