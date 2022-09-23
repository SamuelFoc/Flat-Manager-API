// * EXPRESS SERVER
const express = require("express");
const app = express();
// * PARSERS
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// * CORS POLICY
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
// * ENVIRONMENT
require("dotenv").config();

// MIDLEWARE
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/users", require("./routes/user"));
app.use("/responsibilities", require("./routes/responsibility"));
app.use("/products", require("./routes/product"));
app.use("/events", require("./routes/event"));
app.use("/energies", require("./routes/energy"));
app.use("/services", require("./routes/service"));
app.use("/rooms", require("./routes/room"));
app.use("/refresh", require("./routes/refreshToken"));
app.use("/login", require("./routes/authentication"));
app.use("/logout", require("./routes/logout"));

// ERROR
app.use("*", (req, res) => res.status(403).json("Page not found!"));

// SERVER
app.listen(process.env?.EXTERNAL_PORT || 4001, () => {
  console.log(
    `Server listening on port ${
      process.env?.EXTERNAL_PORT ? process.env?.EXTERNAL_PORT : 4001
    }`
  );
});
