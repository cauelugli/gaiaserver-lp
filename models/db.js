const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const mongoDBUrl = process.env.MONGO_URL;

mongoose.connect(mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("MongoDB connected successfully");
});

module.exports = { mongoose };
