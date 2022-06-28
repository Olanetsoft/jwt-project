const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      user: 'root',
      pass: 'example',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
