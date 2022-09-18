require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

app.post("/register", cors(), async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, displayName, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name && displayName)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      displayName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", cors(), async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
      console.log("i requested login");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/welcome", cors(), auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.get("/", cors(), (req, res) => {
  res.status(200).send("Hello i called you");
  console.log("Hello i called you as default route");
});

// This should be the last route else any after it won't work
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
