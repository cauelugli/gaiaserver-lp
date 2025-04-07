const addRoute = require("./routes/add");
const editRoute = require("./routes/edit");
const editSmallRoute = require("./routes/editSmall");
const deleteRoute = require("./routes/delete");
const getRoute = require("./routes/get");
const notificationsRoute = require("./routes/notifications");
const getConfigRoute = require("./routes/getConfig");
const idIndexListRoute = require("./routes/idIndexList");
const actionsRoute = require("./routes/actions");
const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
const configRoute = require("./routes/config");
// const uploadsRoute = require("./routes/uploads");
const userPreferencesRoute = require("./routes/userPreferences");
const productsRoute = require("./routes/products");
const logsRoute = require("./routes/log");

const routes = [
  { path: "/api/actions", route: actionsRoute },
  { path: "/api/add", route: addRoute },
  { path: "/api/edit", route: editRoute },
  { path: "/api/editSmall", route: editSmallRoute },
  { path: "/api/delete", route: deleteRoute },
  { path: "/api/get", route: getRoute },
  { path: "/api/notifications", route: notificationsRoute },
  { path: "/api/idIndexList", route: idIndexListRoute },
  { path: "/api/admin", route: adminRoute },
  { path: "/api/getConfig", route: getConfigRoute },
  { path: "/api/auth", route: authRoute },
  { path: "/api/login", route: authRoute },
  { path: "/api/config", route: configRoute },
  { path: "/api/products", route: productsRoute },
  // { path: "/api/uploads", route: uploadsRoute },
  { path: "/api/userPreferences", route: userPreferencesRoute },
  { path: "/api/log", route: logsRoute },
];

module.exports = routes;
