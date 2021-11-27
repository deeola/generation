const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const ConnectDB = () => {
    // mongoose
    //   .connect(db)
    //   .then(() => console.log("MongoDB connected"))
    //   .catch((err) => {
    //     console.error(err.message);
    //     process.exit(1);
    //   });

  mongoose.connect(db);
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
};

module.exports = ConnectDB;
