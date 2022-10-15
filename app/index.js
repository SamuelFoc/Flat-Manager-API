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
// * ENVIRONMENT
require("dotenv").config();

// MIDLEWARE
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// ROUTES
app.use("/login", require("./routes/authentication"));
app.use("/logout", require("./routes/logout"));
app.use("/refresh", require("./routes/refreshToken"));
// SAFE ROUTES
//app.use(verifyJWT);
app.use("/admin", require("./routes/admin"));
app.use("/users", require("./routes/user"));
app.use("/responsibilities", require("./routes/responsibility"));
app.use("/products", require("./routes/product"));
app.use("/events", require("./routes/event"));
app.use("/energies", require("./routes/energy"));
app.use("/statistics", require("./routes/statistics"));
app.use("/services", require("./routes/service"));
app.use("/rooms", require("./routes/room"));

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
