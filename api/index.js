const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const customerRoute = require("./routes/customers");
const departmentRoute = require("./routes/departments");
const serviceRoutes = require("./routes/services");
const stockRoutes = require("./routes/stock");
const stockItemRoutes = require("./routes/stockItem");
const jobRoutes = require("./routes/jobs");
const saleRoutes = require("./routes/sales");
const supportRoutes = require("./routes/supports");
const userRoute = require("./routes/users");
const managerRoute = require("./routes/managers");
const quickNotesRoute = require("./routes/quicknotes");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/customers", customerRoute);
app.use("/api/departments", departmentRoute);
app.use("/api/services", serviceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/stockItems", stockItemRoutes);
app.use("/api/supports", supportRoutes);
app.use("/api/users", userRoute);
app.use("/api/managers", managerRoute);
app.use("/api/quicknotes", quickNotesRoute);

app.listen("3000", () => {
  console.log("Backend is running.");
});
