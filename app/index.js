// * EXPRESS SERVER
const express = require("express");
const app = express();
// * PARSERS
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// * CORS POLICY
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyToken");
// * PERFORMANCE DEV
const morgan = require("morgan");
// * DATABASE
const sequelize = require("./util/database");
// * ENVIRONMENT
require("dotenv").config();

// MIDLEWARE
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// LOGGING
switch (process.env.LOGGING_MODE) {
  case "common":
    app.use(
      morgan(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
      )
    );
  case "dev":
    app.use(
      morgan(":method :url :status :response-time ms - :res[content-length]")
    );
  case "off":

  default:
    app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    );
}

// ROUTES
app.use("/login", require("./routes/authentication"));
app.use("/logout", require("./routes/logout"));
app.use("/refresh", require("./routes/refreshToken"));
// SAFE ROUTES
if (process.env.VERIFY_JWT === "true") {
  app.use(verifyJWT);
  console.log("\x1b[32m%s\x1b[0m", "SAFE: JWT verification is enabled.");
} else {
  console.log("\x1b[33m%s\x1b[0m", "CAUTION: JWT verification is disabled!");
}
app.use("/admin", require("./routes/admin"));
app.use("/users", require("./routes/user"));
app.use("/responsibilities", require("./routes/responsibility"));
app.use("/products", require("./routes/product"));
app.use("/events", require("./routes/event"));
app.use("/energies", require("./routes/energy"));
app.use("/statistics", require("./routes/statistics"));
app.use("/services", require("./routes/service"));
app.use("/rooms", require("./routes/room"));
app.use("/payments", require("./routes/payment"));

// ERROR
app.use("*", (req, res) => res.status(403).json("Page not found!"));

// SERVER
app.listen(process.env?.EXTERNAL_PORT || 4001, () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `INFO: Server listening on port ${
      process.env?.EXTERNAL_PORT ? process.env?.EXTERNAL_PORT : 4001
    }`
  );
});
