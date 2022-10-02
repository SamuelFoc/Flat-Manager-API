const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = (model_function, message_info, product_info) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PWD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: message_info.send_to ? message_info.send_to : process.env.EMAIL_ADDRESS,
    subject: message_info?.subject ? message_info?.subject : "",
    text: message_info?.message ? message_info?.message : "",
    html: model_function(product_info),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendMail;
