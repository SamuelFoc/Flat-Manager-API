const User = require("../models/user");

const handleLogout = async (req, res) => {
  // ! On client side also delete the access_token !!
  // * Find refresh token in cookies
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  // * Find user with certain refresh token in DB
  User.findOne({
    where: { refreshToken: refreshToken },
  })
    .then((user) => {
      // * Delete refresh token from DB
      return user.update({ refreshToken: null });
    })
    // * Clear cookies
    .then(() => {
      res.clearCookie("jwt", { httpOnly: true });
      res.sendStatus(204);
    })
    .catch((err) => {
      // * - If there is no user with this refresh token clear cookies
      console.error(err);
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    });
};

module.exports = {
  handleLogout,
};
