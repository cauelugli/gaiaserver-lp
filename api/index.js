const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routeOptions");

dotenv.config();
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));app.use(express.json());
app.use("/attachments", express.static(__dirname + "/uploads/attachments"));
app.use("/images", express.static(__dirname + "/uploads/images"));
app.use("/static", express.static("../uploads"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

routes.forEach(({ path, route }) => {
  app.use(path, route);
});

server.listen(3000, () => {
  console.log("Backend is running.");
});
