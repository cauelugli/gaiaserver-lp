const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const dotenv = require("dotenv");
const { mongoose } = require("../models/db");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const initSocket = require("./websocket");

initSocket(server);

const PORT = 5002;
server.listen(PORT, () => {
  console.log(`Websocket running on port ${PORT}`);
});
