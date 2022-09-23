const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleLogout = async (req, res) => {
  // ! On client side also delete the access_token !!

  // * Find refresh token in cookies
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  // * Find user with certain refresh token in DB
  const user = await User.findOne({
    where: { refresh_token: refreshToken },
  });
  // * - If there is no user with this refresh token clear cookies
  if (!user) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  // * Delete refresh token from DB and clear cookies
  user
    .update({ refresh_token: null })
    .then(() => {
      res.clearCookie("jwt", { httpOnly: true });
      res.sendStatus(204);
    })
    .catch((err) => res.sendStatus(500));
};

module.exports = {
  handleLogout,
};
