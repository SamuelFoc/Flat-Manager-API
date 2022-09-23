const allowedOrigins = require("./allowedOrigins");

// TODO: corsOptions gets allowedOrigins from "./allowedOrigins.js" dynamicly. It can be also stored in database this way. We can also specify mallowed methods and credentials.

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "DELETE", "PUT", "POST"],
  credentials: true,
};

module.exports = corsOptions;
