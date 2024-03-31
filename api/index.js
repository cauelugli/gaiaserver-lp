const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const initSocket = require("./websocket");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const cors = require("cors");

const newRoute = require("./routes/new");
const authRoute = require("./routes/auth");
const configRoute = require("./routes/config");
const clientRoute = require("./routes/clients");
const customerRoute = require("./routes/customers");
const financeRoute = require("./routes/finances");
const departmentRoute = require("./routes/departments");
const serviceRoutes = require("./routes/services");
const servicePlanRoutes = require("./routes/servicePlans");
const positionRoutes = require("./routes/positions");
const productRoutes = require("./routes/products");
const projectsRoutes = require("./routes/projects");
const roleRoutes = require("./routes/roles");
const stockRoutes = require("./routes/stock");
const stockItemRoutes = require("./routes/stockItem");
const jobRoutes = require("./routes/jobs");
const saleRoutes = require("./routes/sales");
const userRoute = require("./routes/users");
const managerRoute = require("./routes/managers");
const operatorsRoute = require("./routes/operators");
const quickNotesRoute = require("./routes/quicknotes");
const quoteRoute = require("./routes/quotes");
const uploadsRoute = require("./routes/uploads");
const agendaRoute = require("./routes/agenda");
const groupsRoute = require("./routes/groups");
const userPreferencesRoute = require("./routes/userPreferences");
const recentActivityRoute = require("./routes/recentActivity");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(__dirname + "/uploads/images"));
app.use("/static", express.static("../uploads"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/new", newRoute);
app.use("/api/login", authRoute);
app.use("/api/config", configRoute);
app.use("/api/clients", clientRoute);
app.use("/api/customers", customerRoute);
app.use("/api/finances", financeRoute);
app.use("/api/departments", departmentRoute);
app.use("/api/services", serviceRoutes);
app.use("/api/servicePlans", servicePlanRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/stockItems", stockItemRoutes);
app.use("/api/users", userRoute);
app.use("/api/managers", managerRoute);
app.use("/api/operators", operatorsRoute);
app.use("/api/quicknotes", quickNotesRoute);
app.use("/api/quotes", quoteRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/agenda", agendaRoute);
app.use("/api/groups", groupsRoute);
app.use("/api/userPreferences", userPreferencesRoute);
app.use("/api/recentActivity", recentActivityRoute);

initSocket(server);

server.listen(3000, () => {
  console.log("Backend is running.");
});
