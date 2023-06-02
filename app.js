require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const User = require("./model/user");
const auth = require("./middleware/auth");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
  })
);

app.use(express.json({ limit: "50mb" }));

app.post("/send-mail", (req, res) => {
  const { name, email, message } = req.body;
  // res.status(200).send("Hello i called you");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "seyi.oyebamiji@gmail.com",
      pass: "Knighttitan",
      type: "OAuth2",
      clientId: "506059073976-6dhfk7r53i62mh843ghi8k16o0inmff1.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken: "1//04drP8yyhU9pSCgYIARAAGAQSNwF-L9IrKjQcFmWChcewS5AGia7TKogwXaWG4GVJcCkitXQsqYWpzYWwQ5CEykXzu0cYT4rcAvQ"
    },
  });

  // Set up the email data
  const mailOptions = {
    from: "rikudoseyi96@gmail.com",
    to: "seyi.oyebamiji@gmail.com",
    subject: "New message from your website",
    text: `Testing`,
    // text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("An error occurred while sending the email.");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully!");
    }
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
