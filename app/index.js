const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

// MIDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// ROUTES
app.use("/users", require("./routes/user"));
app.use("/responsibilities", require("./routes/responsibility"));
app.use("/products", require("./routes/product"));
app.use("/events", require("./routes/event"));
app.use("/energies", require("./routes/energy"));
app.use("/services", require("./routes/service"));
app.use("/rooms", require("./routes/room"));

// SERVER
app.listen(process.env.EXTERNAL_PORT || 4001, () => {
  console.log(
    `Server listening on port ${
      process.env.EXTERNAL_PORT ? process.env.EXTERNAL_PORT : 4001
    }`
  );
});
